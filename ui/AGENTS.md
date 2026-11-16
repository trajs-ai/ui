# AGENTS.md

Project-specific guidance for AI coding agents working under `ui/`.

## Dev server (required)

Debugging a page and showing it to the user both need a running dev server, so
every task that touches a project here runs one and hands the user its URL.

```sh
cd ui/<project> && vp dev    # as a background process, not in the foreground
```

- Run the dev server as a background process so it outlives the command that
  started it, and read the URL it prints (`http://localhost:5173/` unless the
  port was taken). Do not start it in the foreground: that blocks the call and
  ends the server with it.
- Put the URL on the first line of anything you deliver, before any summary of
  the change: a change nobody can open is unverified. Restart the server if the
  URL stopped answering, and report the URL the new process prints — the port
  can change when another checkout holds the old one.
- Stop the server when the task is done, so no dev server is left running past
  the thread that needed it.
