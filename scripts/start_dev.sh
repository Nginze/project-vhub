#!/bin/bash

# Start a new tmux session in detached mode
tmux new-session -d -s DevSession

# Split the window into 4 panes
tmux split-window -h
tmux split-window -v
tmux select-pane -L
tmux split-window -v

# Start the servers in each pane
tmux select-pane -t 0
tmux send-keys "cd ~/Documents/vhub/frontend && pnpm dev" C-m

tmux select-pane -t 1
tmux send-keys "cd ~/Documents/vhub/server && pnpm dev" C-m

tmux select-pane -t 2
tmux send-keys "cd ~/Documents/vhub/worker && pnpm dev" C-m

tmux select-pane -t 3
tmux send-keys "cd ~/Documents/vhub/webrtc-server && pnpm dev" C-m

# Attach to the tmux session
tmux attach-session -t DevSession
