#!/bin/bash

NAME="csc360"

tmux kill-session -t $NAME &> /dev/null

tmux new-session -s $NAME -n $NAME -d
tmux split-window -h -t $NAME
# These splits are a bit hard to understand at first.
#
# (1) The first splits the *right* pane into top
# and bottom, where the *bottom* takes up 75% of
# the height.
#
# (2) The second split the *lower right* pane
# into another top and bottom, and where the bottom
# takes up 66% of the window (1)'s height.
#
# (3) The last (and third) splits the *lower right*
# pane into another top and bottom, where the
# bottom takes up 50% of window (2)'s height.
#

tmux split-window -t $NAME:0.1 -v -p 75
tmux split-window -t $NAME:0.2 -v -p 66
tmux split-window -t $NAME:0.3 -v -p 50

tmux select-pane -t $NAME:0.0
tmux split-window -t $NAME:0.0 -v -p 25


tmux send-keys -t $NAME:0.0 './myserver --meetup 2 --meetfirst' C-m
sleep 1
tmux send-keys -t $NAME:0.1 'curl "localhost:14998/?op=meetup&val=alice"' C-m
tmux send-keys -t $NAME:0.2 'curl "localhost:14998/?op=meetup&val=carol"' C-m
tmux send-keys -t $NAME:0.3 'curl "localhost:14998/?op=meetup&val=bob"' C-m
tmux send-keys -t $NAME:0.4 'curl "localhost:14998/?op=meetup&val=ted"' C-m

tmux attach -t $NAME

