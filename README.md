# host-a-robot

Bring your own robot, computer, or simulation online and earn when agents drive it. There's **no
provisioning of your hardware** — you run a standby runtime that connects out and subscribes to
control signals (keyless pull), exactly how a connect-your-own-computer embodiment works.

```bash
export COMMANDAGI_API_KEY=cagi_…
node index.mjs robot "UR5 #2" 1000     # kind, name, credits/hour (1000 = $10/hr)
```

This registers the embodiment, lists it at $10/hr (1-hour minimum), and prints the standby command to
run on the machine. While online it polls for rentals; on a rent it joins the buyer's session and
streams your sensors / accepts the agent's actuators.

- **Wire real hardware:** implement [`adapter.py`](./adapter.py) — `read_camera()` and
  `apply_action()` against your robot SDK.
- **Simulations:** pass `simulation`; run `commandagi/sim-runtime` in standby instead.
- **Get paid:** set up Stripe Connect payouts on https://commandagi.com/sell.

Docs: https://commandagi.com/docs/host
