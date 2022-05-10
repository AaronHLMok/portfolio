/*Required Headers*/

#include <pthread.h>
#include <stdio.h>
#include <stdlib.h>
#include <string.h>
#include <semaphore.h>
#include "meetup.h"
#include "resource.h"
#include <unistd.h>


/*
 * Declarations for barrier shared variables -- plus concurrency-control
 * variables -- must START here.
 * self note: pthread_mutex_t and pthread_cond_t only, meetfirst == 1, meetlast == 0
 * t_count is thread count, n is number of threads b4 join, meet is mf, count is barrier count
 */
static resource_t keyword;
char* buffer;
int generation;
int t_max;
int meet;
int count;
int t_count;
int num;

pthread_cond_t mandalorian;
pthread_mutex_t this_is_not_the_way;
void* this_is_the_way;

/*read and write are both from rw.c. more info is there.*/
void r_read(char* value, int len) {
	if ((sizeof(buffer) / sizeof(*buffer)) < len) {
		buffer = (char*)realloc(buffer, len);
	}
	read_resource(&keyword, buffer, len);
	strncpy(value, buffer, len);
}

void r_write(char* value, int len) {
	if ((sizeof(buffer) / sizeof(*buffer)) < len) {
		buffer = (char*)realloc(buffer, len);
	}
	strncpy(buffer, value, len);
	write_resource(&keyword, buffer, len);
}

void* test(void* v) {
	printf("Bobafet has arrived\n");
}

/*taken from slide 73*/
/*possible error: generation not properly implemented. Might need a second mutex*/
void *barrier() {
	/*Hah, get it? barriers and mandalorians ... I'm done :D*/
	pthread_mutex_lock(&this_is_not_the_way);
	count += 1;
	if (count < t_max) {
		int gen = generation;
		while (gen == generation) {
			pthread_cond_wait(&mandalorian, &this_is_not_the_way);
		}
	} else {
		count = 0;
		generation++;
		pthread_cond_broadcast(&mandalorian);
	}
	pthread_mutex_unlock(&this_is_not_the_way);
}

void initialize_meetup(int n, int mf) {
	t_max = n;
	meet = mf;
}

/*The idea was if mf = 1 and thread count == 0, write that to resourse t, and if mf == 0 and t_count == max it would write
 *the last person's key word. While the max limit has not been reached, barrier and read when released. sleep is to give some time for
 *writer to write first.
 */
void join_meetup(char* value, int len) {
	//void* val;
	//pthread_t bobafets[t_max];
	if (meet == 1 && t_count == 0) {
		r_write(value, len);
	} else if (t_count == t_max) {
		r_write(value, len);
	}

	if (t_count < t_max) {
		t_count++;
		barrier();
	}

	t_count = 0;
	sleep(5);
	r_read(value, len);
}

/* please ignore my ignorance here
for (int i = 0; i < 4; i++) {
	if (pthread_create(&temp[i], 0, barrier, NULL) < 0) {
		fprintf(stderr, "error\n");
		exit(1);
	}
}*/