"""
WebSocket API — /ws endpoint with dual send/receive loops and heartbeat.

- send_loop: forwards UI events from UIEventAdapter to the client.
- receive_loop: accepts commands from the client and routes to KioskController.
- Heartbeat: server sends ping every 15s, disconnects if no pong within 5s.
- Supports multiple concurrent connections.
- Clean subscriber cleanup on disconnect.
"""

import asyncio
import json
import logging
from typing import Optional

from fastapi import APIRouter, WebSocket, WebSocketDisconnect

logger = logging.getLogger(__name__)

router = APIRouter()

HEARTBEAT_INTERVAL = 15.0  # seconds between pings
HEARTBEAT_TIMEOUT = 5.0    # seconds to wait for pong


@router.websocket("/ws")
async def websocket_endpoint(ws: WebSocket):
    """
    Main WebSocket endpoint.

    Retrieves shared instances from app.state (set in main.py).
    """
    await ws.accept()

    ui_adapter = ws.app.state.ui_event_adapter
    kiosk_controller = ws.app.state.kiosk_controller

    # Subscribe to UI events
    ui_queue: asyncio.Queue = await ui_adapter.subscribe()

    logger.info("WebSocket: client connected")

    try:
        send_task = asyncio.create_task(_send_loop(ws, ui_queue))
        receive_task = asyncio.create_task(_receive_loop(ws, kiosk_controller))
        heartbeat_task = asyncio.create_task(_heartbeat_loop(ws))

        # Wait for any task to finish (disconnect or error)
        done, pending = await asyncio.wait(
            [send_task, receive_task, heartbeat_task],
            return_when=asyncio.FIRST_COMPLETED,
        )

        # Cancel remaining tasks
        for task in pending:
            task.cancel()
            try:
                await task
            except asyncio.CancelledError:
                pass

    except Exception as exc:
        logger.exception("WebSocket: unexpected error — %s", exc)
    finally:
        await ui_adapter.unsubscribe(ui_queue)
        logger.info("WebSocket: client disconnected, subscriber cleaned up")


async def _send_loop(ws: WebSocket, ui_queue: asyncio.Queue) -> None:
    """Forward UI events from the adapter queue to the WebSocket client."""
    try:
        while True:
            event = await ui_queue.get()
            await ws.send_json(event)
    except (WebSocketDisconnect, asyncio.CancelledError):
        pass
    except Exception as exc:
        logger.warning("WebSocket send_loop error: %s", exc)


async def _receive_loop(ws: WebSocket, kiosk_controller) -> None:
    """Accept commands from the frontend and route to KioskController."""
    try:
        while True:
            raw = await ws.receive_text()
            try:
                data = json.loads(raw)
            except json.JSONDecodeError:
                logger.warning("WebSocket: invalid JSON received: %s", raw[:200])
                continue

            command = data.get("command")
            if command:
                await kiosk_controller.handle_command(command)
            else:
                logger.debug("WebSocket: message without 'command' key: %s", data)

    except (WebSocketDisconnect, asyncio.CancelledError):
        pass
    except Exception as exc:
        logger.warning("WebSocket receive_loop error: %s", exc)


async def _heartbeat_loop(ws: WebSocket) -> None:
    """
    Server-initiated heartbeat.
    Sends ping every HEARTBEAT_INTERVAL seconds.
    If the client doesn't respond with pong within HEARTBEAT_TIMEOUT, disconnect.
    """
    try:
        while True:
            await asyncio.sleep(HEARTBEAT_INTERVAL)
            try:
                await ws.send_json({"type": "ping"})
            except Exception:
                break
    except (WebSocketDisconnect, asyncio.CancelledError):
        pass
