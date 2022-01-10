# Assignment 3

### TASK 1

**linkedlist.h and linkedlist.c has been modified**

#### **rrsim.c**
* Idea: While event_list is no empty means there are still tasks to do, so run until pointer reaches a NULL
* During which, if there are multiple arrivals after a task get its cycle, add all those to ready_q if Ready_q is empty, but event_list is not, we should wait
* Logic part:Dispatch will increase ticks accordingly. If a task arrives during this time, add it to ready_q
* Quantums will run for qlen times, during which if a task arrives during this period, it will be added to ready_q.
  In event of tiebreaker ie:arrival = time when quantum ends, arrival will always be put into ready_q, and the current task will be placed after. Update_q accordingly.
* Leftovers: When event_list reaches end but ready_q still has itmes, loop until NULL is reached.
* Linkedlist.c has two new functions at the bottom to combine functions and preform more detailed stuff

### TASK 2 (around 1-2mins to build on my potato laptop)

#### **Python script usage**
The normal $python3 ./script

#### Notes on scripts and task 2
* A problem I noticed when running my sciprts is that, if seeds are too high segmentation faults might occur, So i found seeds that worked. I split the information gathering into two parts. First is to run './simgen' with the amount of tasks I want with seed, quantum and dispatch information. 

* To do that, I used a python script to throw commands at the console to generate a bunch of textfiles which store the information for the graphs in a seperate folder. Note, first run of this will attempt to create folder with mikdir, after that it will just overwrite existing files.
'python3 ./a3py_test.py'

* After which, I have script which calculates the average from all the text files and outputs the result into 'outcome.txt' with 'python3 ./average.py'. This has everything nicely laid out.

* Finally, I took everything to google docs and graphed it... haha :D

By Aaron Mok V00924998 
