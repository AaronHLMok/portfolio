
#### **virtmem.c**

* Idea: Have a function return the desired victim frame.

### FIFO

The idea was simple, use an integer to keep track of current victim frame starting at 0. When a frame is
selected and replaced, the integer will increment by one.

### LRU

I approached this task with a linked list. I created one with two functions, add to end and delete front.
In addition, I had an integer to keep count of how many nodes are being tracked, equal to the amount of
physical frames. Once this limit is reached, victims frames are selected from the head node, which is then
deleted after. The list will append and remove accorindingly to keep constant size. 

### Second Chance

This part heavly reused FIFO as its base. An extra 'valid' integer was added to the provided struct,
which is set to 1 when introduced. When it comes to replacement, the frame counter will start at 0.
From there, check frames for a valid integer 'FALSE' and returns that frame number while setting current
value to 0. When a page already exists in a frame, set valid back to 1.


By Aaron Mok
