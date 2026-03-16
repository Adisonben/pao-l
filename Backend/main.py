"""
Pao-L Kiosk Backend — Main entry point.

Wires together all layers:
    EventBus → CommandBus → DeviceManager → Services → KioskController
    → UIEventAdapter → WebSocket/REST API → Watchdog

Run: python main.py
"""

import sys
import os
import signal
import asyncio
import logging

sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from utils.logger import setup_logging, get_logger
from core.event_bus import EventBus
from core.command_bus import CommandBus
from core.device_manager import DeviceManager
from core.watchdog import Watchdog
from controller.session_manager import SessionManager
from controller.kiosk_controller import KioskController
from services.alcohol_service import AlcoholService
from services.fingerprint_service import FingerprintService
from services.printer_service import PrinterService
from services.camera_service import CameraService
from adapters.ui_event_adapter import UIEventAdapter
from api.websocket import router as ws_router
from api.rest import router as rest_router

# Initialize logging first
setup_logging()
logger = get_logger(__name__)

# ── FastAPI app ───────────────────────────────────────────────

app = FastAPI(
    title="Pao-L Alcohol Testing System API",
    description="Production kiosk backend with WebSocket, EventBus, and state machine",
    version="2.0.0",
    docs_url="/docs",
    redoc_url="/redoc",
    openapi_url="/openapi.json",
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Restrict in production
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include routers
app.include_router(ws_router)
app.include_router(rest_router)


# ── Startup ───────────────────────────────────────────────────

@app.on_event("startup")
async def startup():
    logger.info("=== Pao-L Backend starting ===")

    # Core buses
    event_bus = EventBus()
    command_bus = CommandBus()

    # Session manager
    session_manager = SessionManager(event_bus)

    # Device services
    alcohol_svc = AlcoholService(event_bus, command_bus)
    fingerprint_svc = FingerprintService(event_bus)
    printer_svc = PrinterService(event_bus, command_bus)
    camera_svc = CameraService(event_bus, command_bus)

    # Device manager — register all services
    device_manager = DeviceManager(event_bus)
    device_manager.register("alcohol", alcohol_svc)
    device_manager.register("fingerprint", fingerprint_svc)
    device_manager.register("printer", printer_svc)
    device_manager.register("camera", camera_svc)

    # Kiosk controller (state machine)
    kiosk_controller = KioskController(event_bus, command_bus, session_manager)

    # UI event adapter
    ui_event_adapter = UIEventAdapter(event_bus)

    # Watchdog supervisor
    watchdog = Watchdog(device_manager, event_bus, interval=5.0)

    # Store in app.state for access by routers
    app.state.event_bus = event_bus
    app.state.command_bus = command_bus
    app.state.session_manager = session_manager
    app.state.device_manager = device_manager
    app.state.kiosk_controller = kiosk_controller
    app.state.ui_event_adapter = ui_event_adapter
    app.state.watchdog = watchdog

    # Start everything
    await device_manager.start_all()
    await kiosk_controller.start()
    await ui_event_adapter.start()
    await watchdog.start()

    logger.info("=== Pao-L Backend ready ===")


# ── Shutdown ──────────────────────────────────────────────────

@app.on_event("shutdown")
async def shutdown():
    logger.info("=== Pao-L Backend shutting down ===")

    await app.state.watchdog.stop()
    await app.state.ui_event_adapter.stop()
    await app.state.kiosk_controller.stop()
    await app.state.device_manager.stop_all()

    logger.info("=== Pao-L Backend stopped ===")


# ── Entry point ───────────────────────────────────────────────

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
