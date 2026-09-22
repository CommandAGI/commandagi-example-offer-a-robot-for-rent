"""Hardware adapter stub — wire your real robot behind the CommandAGI runtime.

When someone rents your device, the standby runtime launches a session bound to your hardware and
exchanges two kinds of messages over the session WebSocket:

  • SENSORS (you publish): camera frames, joint states, etc. — the agent/human sees these.
  • ACTUATORS (you receive): control actions — you apply them to the real robot.

This is the same uniform sensor/actuator contract a cloud VM or 3D physics sim uses (see
docs/ONTOLOGY.md). Implement the two functions below against your robot's SDK, then point the
runtime at this adapter. For most arms/bases that's a few dozen lines over ROS, a vendor SDK, or
serial. CommandAGI never reaches into your machine — your runtime connects out and subscribes.

Safety: keep an owner-held e-stop, geofence/rate-limit actuators, and revoke access by stopping
the runtime. Renting grants the buyer `operator`, which you can pull at any time.
"""
from __future__ import annotations

import base64


def read_camera() -> str:
    """Return the head/scene camera as a base64 PNG (a sensor frame the agent perceives)."""
    # frame = my_robot.camera.grab()            # e.g. an OpenCV BGR array → PNG bytes
    # return base64.b64encode(png_bytes).decode()
    raise NotImplementedError("Return a base64 PNG from your camera here")


def apply_action(action: dict) -> None:
    """Apply one actuator command from the agent to the real robot.

    Action shapes mirror the runtime's actuator channels, e.g.:
      {"type": "base", "vx": 0.2, "wz": 0.0}        # drive the base
      {"type": "joints", "positions": [...]}         # set joint targets
      {"type": "gripper", "open": false}             # actuate the gripper
    """
    kind = action.get("type")
    if kind == "base":
        ...  # my_robot.base.drive(action["vx"], action["wz"])
    elif kind == "joints":
        ...  # my_robot.arm.move_to(action["positions"])
    elif kind == "gripper":
        ...  # my_robot.gripper.set(open=action["open"])
    raise NotImplementedError(f"Map action {kind!r} to your robot SDK")
