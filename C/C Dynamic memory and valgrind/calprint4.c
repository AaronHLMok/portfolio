/*
 * calprint4.c
 *
 * Starter file provided to students for Assignment #4, SENG 265,
 * Summer 2019.
 */

#include <assert.h>
#include <stdio.h>
#include <stdlib.h>
#include <string.h>
#include "emalloc.h"
#include "ics.h"
#include <ctype.h>
#include "listy.h"
#include <time.h>

/*del emalloc and listy*/
void* emalloc(size_t n) {
	void* p;

	p = malloc(n);
	if (p == NULL) {
		fprintf(stderr, "malloc of %zu bytes failed", n);
		exit(1);
	}

	return p;
}

node_t* new_node(event_t* val) {
	assert(val != NULL);

	node_t* temp = (node_t*)emalloc(sizeof(node_t));

	temp->val = val;
	temp->next = NULL;

	return temp;
}


node_t* add_front(node_t* list, node_t* new) {
	new->next = list;
	return new;
}


node_t* add_end(node_t* list, node_t* new) {
	node_t* curr;

	if (list == NULL) {
		new->next = NULL;
		return new;
	}

	for (curr = list; curr->next != NULL; curr = curr->next);
	curr->next = new;
	new->next = NULL;
	return list;
}


node_t* peek_front(node_t* list) {
	return list;
}


node_t* remove_front(node_t* list) {
	if (list == NULL) {
		return NULL;
	}

	return list->next;
}



void apply(node_t* list,
	void (*fn)(node_t* list, void*),
	void* arg)
{
	for (; list != NULL; list = list->next) {
		(*fn)(list, arg);
	}
}

/*extract %8c from dt start (yymmdd)*/
char* ext_one(node_t* n) {
	assert(n != NULL);
	event_t* event = n->val;
	char* temp = emalloc(sizeof(char) * 17);
	strncpy(temp, event->dtstart, 17);
	char* ptr = strtok(temp, "T");
	return ptr;
}

char* ext_two(char* time) {
	char* temp = emalloc(sizeof(char) *17 );
	strncpy(temp, time, 17);
	char* ptr = strtok(temp, "T");
	ptr = strtok(NULL, "\0");
	return ptr;
}

void dt_increment(char* after, const char* before, int const num_days)
{
	struct tm temp_time;
	time_t    full_time;

	memset(&temp_time, 0, sizeof(struct tm));
	sscanf(before, "%4d%2d%2d", &temp_time.tm_year,
		&temp_time.tm_mon, &temp_time.tm_mday);
	temp_time.tm_year -= 1900;
	temp_time.tm_mon -= 1;
	temp_time.tm_mday += num_days;

	full_time = mktime(&temp_time);
	after[0] = '\0';

	strftime(after, 9, "%Y%m%d", localtime(&full_time));
	strncpy(after + 8, before + 8, 80 - 8);
	after[80 - 1] = '\0';
}
//converts from yyyymmdd -> mm dd, yyyy (day)
char *dt_format(const char* dt_time)
{
	struct tm temp_time;
	time_t    full_time;
	char* formatted_time = emalloc(sizeof(char));

	memset(&temp_time, 0, sizeof(struct tm));
	sscanf(dt_time, "%4d%2d%2d",
		&temp_time.tm_year, &temp_time.tm_mon, &temp_time.tm_mday);
	temp_time.tm_year -= 1900;
	temp_time.tm_mon -= 1;
	full_time = mktime(&temp_time);
	strftime(formatted_time, 80, "%B %d, %Y (%a)", localtime(&full_time));

	return formatted_time;
}

 char *time_fmt(char* dt_time) {
	char* temp = emalloc(sizeof(char)*17);
	temp = ext_two(dt_time);

	struct tm temp_time;
	time_t full_time;
	char* formatted_time = emalloc(sizeof(char)*17);

	memset(&temp_time, 0, sizeof(struct tm));
	sscanf(temp, "%2d%2d", &temp_time.tm_hour, &temp_time.tm_min);
	strftime(formatted_time, 80, "%I:%M %p", &temp_time);

	return formatted_time;
}

void sort_data(char* filename, node_t** main_list) {
	//read and store data

	FILE* data = fopen(filename, "r");
	if (data == NULL) {
		fprintf(stderr, "unable to open\n");
	}

	event_t* temp_event = NULL;
	node_t* temp_node = NULL;
	temp_node = emalloc(sizeof(event_t));
	char* buffer = emalloc(sizeof(char) * 100);
	char* temp = emalloc(sizeof(char) * 100);

	while (fgets(buffer, sizeof(char) * 100, data)) {
		if (strncmp(buffer, "DTSTART:", 8) == 0) {
			temp_event = emalloc(sizeof(event_t));
			sscanf(buffer, "DTSTART:%16c", temp);
			strncpy(temp_event->dtstart, temp, 17);

		}
		if (strncmp(buffer, "DTEND:", 6) == 0) {
			sscanf(buffer, "DTEND:%16c", temp);
			strncpy(temp_event->dtend, temp, 17);
		}
		if (strncmp(buffer, "SUMMARY:", 8) == 0) {
			char* ptr = strtok(buffer, ":");
			ptr = strtok(NULL, "\n");
			strncpy(temp_event->summary, ptr, SUMMARY_LEN);
		}
		if (strncmp(buffer, "LOCATION:", 9) == 0) {
			char* ptr = strtok(buffer, ":");
			ptr = strtok(NULL, "\n");
			strncpy(temp_event->location, ptr, LOCATION_LEN);
		}
		if (strncmp(buffer, "RRULE:", 6) == 0) {
			sscanf(buffer, "RRULE:FREQ=WEEKLY;WKST=MO;UNTIL=%8c", temp);			//flawed, try and modify later
			strncpy(temp_event->rrule, temp, RRULE_LEN);
		}
		if (strncmp(buffer, "END:VEVENT", 10) == 0) {
			temp_node = new_node(temp_event);
			*main_list = add_front(*main_list, temp_node);
		}
	}

	fclose(data);

	assert(buffer != NULL);
	assert(temp != NULL);
	assert(temp_node != NULL);
	free(temp_node);
	free(buffer);
	free(temp);
}


char *dashlength(int n) {
	char* dlength = calloc(sizeof(char), sizeof(char));
	if (dlength == NULL) {
		fprintf(stderr,"failed calloc");
		exit(1);
	}
	int d;
	char dashes[1] = "-";
	for (d = 0; d < n; ++d) {
		strncat(dlength, dashes, 1);
	}

	return dlength;
}


void print_event(node_t* n, void* arg) {
	assert(n != NULL);
	event_t* event = n->val;
	printf("%s to %s: %s [%s]", time_fmt(event->dtstart), time_fmt(event->dtend),
		event->summary, event->location);
}

void del(node_t* n, node_t *temp, event_t * temp_event) {
	temp = n->next;
	assert(temp == NULL);
	n = remove_front(n);
	temp_event = temp->val;
	assert(temp_event != NULL);
	n = temp;
}

void check_rule(node_t* n, node_t *temp) {
	event_t* event = n->val;
	if (strncmp(event->rrule, "", 1) == 0) {
		del(n, temp, event);
	}
	else {
		/*update_node*/
	}
}

//problem with while loop,
void output(node_t* list, int start, int end) {
	while(list != NULL){
		node_t* head = NULL;
		node_t* temp = NULL;

		head = list;
		
		if (atoi(ext_one(head)) == start) {
			char* a = ext_one(head);
			int dlen = strlen(dt_format(a));
			char* b = dashlength(dlen);

			printf("%s\n%s\n", dt_format(a), b);
			apply(head, print_event, NULL);
			check_rule(head, temp);
		}

		else if (atoi(ext_one(head)) > end) {
			event_t* event;
			del(head,temp,event);
		}

	}
	
}

int combine(int y, int m, int d) {

	int total = 0;

	if (m < 10) {
		m = (m * 100) + d;
	}
	else {
		m = (m * 10) + d;
	}

	total = (y * 10000) + m;

	return total;
}

int main(int argc, char *argv[])
{
    int from_y = 0, from_m = 0, from_d = 0;
    int to_y = 0, to_m = 0, to_d = 0;
    char *filename = NULL;
    int i; 

    for (i = 0; i < argc; i++) {
        if (strncmp(argv[i], "--start=", 7) == 0) {
            sscanf(argv[i], "--start=%d/%d/%d", &from_d, &from_m, &from_y);
        } else if (strncmp(argv[i], "--end=", 5) == 0) {
            sscanf(argv[i], "--end=%d/%d/%d", &to_d, &to_m, &to_y);
        } else if (strncmp(argv[i], "--file=", 7) == 0) {
            filename = argv[i]+7;
        }
    }

    if (from_y == 0 || to_y == 0 || filename == NULL) {
        fprintf(stderr, 
            "usage: %s --start=dd/mm/yyyy --end=dd/mm/yyyy --file=icsfile\n",
            argv[0]);
        exit(1);
    }

	int abs_start = combine(from_y,from_m,from_d);
	int abs_end = combine(to_y,to_m, to_d);

	node_t *main_list = NULL;
	sort_data(filename, &main_list);	
	output(main_list, abs_start, abs_end);
    exit(0);
}
