/*Required Headers*/

#include <pthread.h>
#include <stdio.h>
#include <stdlib.h>
#include <string.h>
#include <semaphore.h>
#include "rw.h"
#include "resource.h"
#include <unistd.h>
#include <malloc.h>

/*
 * Declarations for reader-writer shared variables -- plus concurrency-control
 * variables -- must START here.
 */

/*
*code below is heavily influenced by psudo code provided in the text book and lecture slides. (chapter 6 on syncronization)
*side note:
*based on multiple testing, majority of the time the code will execute and provide intended results.
*However two problems occured. First is when read was entered before write, which messes up everything. 
*Second is with connection 'unknown'. This problem occurs randomly, at that point please run the code again.
*/
static resource_t data;
int readcount = 0;
int writecount = 0;
char *buffer;
sem_t mutex, wrt;

/*Setting my 'mutex' and 'writer' */
void initialize_readers_writer() {
    /*
     * Initialize the shared structures, including those used for
     * synchronization.
     */
	sem_init(&mutex, 0, 1);
	sem_init(&wrt, 0, 1);
	//init_resource(&data, "data:");
}

/*Problem with buffer, I did use dynamic memory to adjust the size of buffer in accordance to len however,
 *there is no free(buffer). That aside, the code will still work. For both read/write, I made sure that my mutex variables
 *remained automic by incrementing/decrementing at appropriate places.
 *
 * read *
 * a do while loop as refference in the text book, the body and placement of mutexes were based off the slides. Lock when entering, and
 * release when done. When reading, take whatever is in resourse_t (data) and stuff it into value with strncpy.
 * adjust count values and release lock.
 */
void rw_read(char *value, int len) {
	do {
		sem_wait(&mutex);
		readcount++;
		if (readcount == 1) {
			sem_wait(&wrt);
		}

		sem_post(&mutex);
		/*read here*/
		if ((sizeof(buffer)/sizeof(*buffer)) < len) {
			buffer = (char*)realloc(buffer, len);
		}
		read_resource(&data, buffer, len);
		strncpy(value, buffer, len);
		//print_stats(&data);

		sleep(1);
		sem_wait(&mutex);

		if (--readcount == 0) {
			sem_post(&wrt);
		}
		sem_post(&mutex);
	} while (!(writecount == 0));
}

/*write
 *do while loop is based off textbook and body is from slides. Lock when entering. Check if buffer size is enough to store
 *what ever is in value, and 'write' value into buffer. Unlock and adjust variables when done.
 */
void rw_write(char *value, int len) {
	do {
		sem_wait(&wrt);
		writecount++;

		/* write here*/
		if ((sizeof(buffer) / sizeof(*buffer)) < len) {
			buffer = (char*)realloc(buffer, len);
		}
		strncpy(buffer, value, len);
		write_resource(&data, buffer, len);
		//print_stats(&data);

		sleep(1);
		sem_post(&wrt);
		writecount--;
	} while (!(writecount == 0) && (readcount == 0));
}
