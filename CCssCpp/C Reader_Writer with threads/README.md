V00924998
Aaron Mok
Assignment 2

Known problems:out put is never the same, but rw.c should work perfectly fine.
meetup on the otherhand is a little wonky... on the initial run of senario2.sh it has a low
chance of outputting the correct info (two keyword, both meetfirst option)
subsequent curl requests after seems to work. eg calling 2 curls after initial senario2 will produce keyword

Part1)Was heavily influenced by the lecture slides. Ran multiple times and should provide intended results
There are some problems however, mostly to do with timing probably? UNKOWN will show up on server from time to time
and write/read sometimes doesn't want to co-operate. Another thing to note is the use of dynamic memory, might pose
a problem because I did not free the memory, touchy other files is a nono

Part2)Aslo heavily influenced by lecture slide, specifically 73. I tried to add a little spice to make things more
ineresting. Please ignore the bottom section of the code, I thought we had to create our own threads. I copied and
pased the read/write from rw.c here.
