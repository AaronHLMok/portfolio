/*
 * Skeleton code for CSC 360, Spring 2021,  Assignment #4
 *
 * Prepared by: Michael Zastre (University of Victoria) 2021
 */

#include <stdio.h>
#include <stdlib.h>
#include <string.h>
#include <sys/types.h>
#include <sys/stat.h>
#include <unistd.h>

/*
 * Some compile-time constants.
 */

#define REPLACE_NONE 0
#define REPLACE_FIFO 1
#define REPLACE_LRU  2
#define REPLACE_SECONDCHANCE 3
#define REPLACE_OPTIMAL 4


#define TRUE 1
#define FALSE 0
#define PROGRESS_BAR_WIDTH 60
#define MAX_LINE_LEN 100


/*
 * Some function prototypes to keep the compiler happy.
 */
int setup(void);
int teardown(void);
int output_report(void);
long resolve_address(long, int);
void error_resolve_address(long, int);

/*Added extra prototypes. Please note, optimal was added on but not fully implemented.*/
int my_solution();
int fifo();
int lru();
int secondchance();
void optimal();


/*
 * Variables used to keep track of the number of memory-system events
 * that are simulated.
 */
int page_faults = 0;
int mem_refs    = 0;
int swap_outs   = 0;
int swap_ins    = 0;


/*
 * Page-table information. You may want to modify this in order to
 * implement schemes such as SECONDCHANCE. However, you are not required
 * to do so.
 */
struct page_table_entry *page_table = NULL;
struct page_table_entry {
    long page_num;
    int dirty;
    int free;
	int valid;
};

/*
 * Added a struct for linked lists, which will be used for LRU replacment policy
 * I've only added two functionalities to this struct, add end and remove front.
 * Back bone to this is from a3.
 */
typedef struct lru_node lru_node_t;
struct lru_node {
	int frame;
	struct lru_node* next;
};
lru_node_t* lru_list = NULL;

lru_node_t* add_end(lru_node_t* list, int frame) {
	lru_node_t* temp;
	lru_node_t* curr;
	temp = (lru_node_t*)malloc(sizeof(lru_node_t));
	if (!temp) {
		fprintf(stderr, "error on malloc\n");
	}
	temp->next = NULL;
	temp->frame = frame;

	if (list == NULL) {
		return temp;
	}

	for (curr = list; curr->next != NULL; curr = curr->next);
	curr->next = temp;
	temp->next = NULL;
	return list;
}

lru_node_t *del_head(lru_node_t* list) {
	lru_node_t* cur;
	if (!list) {
		fprintf(stderr, "list empty");
		exit(0);
	}
	cur = list;
	list = list->next;
	cur->next = NULL;
	free(cur);
	return list;
}
/*
 * These global variables will be set in the main() function. The default
 * values here are non-sensical, but it is safer to zero out a variable
 * rather than trust to random data that might be stored in it -- this
 * helps with debugging (i.e., eliminates a possible source of randomness
 * in misbehaving programs).
 */

int size_of_frame = 0;  /* power of 2 */
int size_of_memory = 0; /* number of frames */
int page_replacement_scheme = REPLACE_NONE;
int victim_frame = 0; /* --New-- This variable is used to keep track of fifo and second chance replacments */
int node_count = 0;

/*
 * Function to convert a logical address into its corresponding 
 * physical address. The value returned by this function is the
 * physical address (or -1 if no physical address can exist for
 * the logical address given the current page-allocation state.
 */

/*  
 * I've added .dirty and .valid in a few spots for correctness. Please see line 242 for the replacement part itself.
 */
long resolve_address(long logical, int memwrite)
{
	int i;
	long page, frame;
	long offset;
	long mask = 0;
	long effective;

	/* Get the page and offset */
	page = (logical >> size_of_frame);

	for (i = 0; i < size_of_frame; i++) {
		mask = mask << 1;
		mask |= 1;
	}
	offset = logical & mask;

	/* Find page in the inverted page table. */
	frame = -1;
	for (i = 0; i < size_of_memory; i++) {
		if (!page_table[i].free && page_table[i].page_num == page) {
			frame = i;
			if (memwrite == TRUE) {
				page_table[frame].dirty = TRUE;
				page_table[frame].valid = TRUE;
			}
			break;
		}
	}

    /* If frame is not -1, then we can successfully resolve the
     * address and return the result. */
    if (frame != -1) {
        effective = (frame << size_of_frame) | offset;
		if (memwrite == TRUE) {
			page_table[frame].dirty = TRUE;
			page_table[frame].valid = TRUE;
		}
		/*add tail delete head*/
		if (node_count < size_of_memory && page_replacement_scheme == 2) {
			lru_list = add_end(lru_list, frame);
			node_count++;
			if (node_count >= size_of_memory) {
				lru_list = del_head(lru_list);
				node_count--;
			}
		}
        return effective;
    }


    /* If we reach this point, there was a page fault. Find
     * a free frame. */
    page_faults++;

    for ( i = 0; i < size_of_memory; i++) {
        if (page_table[i].free) {
            frame = i;
			if (memwrite == TRUE) {
				page_table[frame].dirty = TRUE;
			}
            break;
        }
    }

    /* If we found a free frame, then patch up the
     * page table entry and compute the effective
     * address. Otherwise return -1.
     */
    if (frame != -1) {
        page_table[frame].page_num = page;
        page_table[i].free = FALSE;
        swap_ins++;
        effective = (frame << size_of_frame) | offset;
		if (node_count < size_of_memory && page_replacement_scheme == 2) {
			lru_list = add_end(lru_list, frame);
			node_count++;
			if (node_count >= size_of_memory) {
				lru_list = del_head(lru_list);
				node_count--;
			}
		}
        return effective;
    } 

	/* modifications start here 
	 * The idea was to have a function retrieve the needed frame to replace. Once called, it will determine
	 * which policy it will use. When the function returns, it replaces the frame, updates swap_outs if needed and update
	 * the entry information.
	 */
	
	victim_frame = my_solution(frame);
	if (victim_frame != -1) {
		if (page_table[victim_frame].dirty == TRUE) {
			swap_outs++;
		}
		page_table[victim_frame].page_num = page;
		page_table[victim_frame].free = FALSE;	
		if (memwrite == TRUE) {
			page_table[victim_frame].dirty = TRUE;
		}
		else {
			page_table[victim_frame].dirty = FALSE;
		}
		effective = (victim_frame << size_of_frame) | offset;
		page_table[victim_frame].valid = TRUE;
		if (page_replacement_scheme == 1) {
			victim_frame++;
		}
		if (node_count < size_of_memory && page_replacement_scheme == 2) {
			lru_list = add_end(lru_list, victim_frame);
			node_count++;
			if (node_count >= size_of_memory) {
				lru_list = del_head(lru_list);
				node_count--;
			}
		}
		return effective;
	}

	return -1;
}

/*
 * A bunch of switch statements to determine replacement policy
 */
int my_solution(long page) {
	int frame_num = -1;

	switch (page_replacement_scheme) {
	case 0:
		break;
	case 1:
		frame_num = fifo();
		break;
	case 2:
		frame_num = lru();
		break;
	case 3:
		frame_num = secondchance();
		break;
	case 4:
		optimal();
		break;
	}
	swap_ins++;
	return frame_num;
}

/*Idea: Based on frame size from user input, I will use a global variable to keep track which
 *entry should be selected as the victim frame. This integer will increment after each run of fifo()
 *due to the nature of fifo being easy to implement using counting
 */
int fifo() {
	if (victim_frame >= size_of_memory){
		victim_frame = 0;
	}
	return victim_frame;
}

/*Idea: Based on frame size again, but this time we will introduce the concept of looking backwards. To accomplish this,
 *I picked linked list to keep track of the n'th accessed page number, It's better than making an array, and quite easy to
 *pull out head and attach tail. The linked list size is always the same as page frame size
 */
int lru() {
	victim_frame = lru_list->frame;
	return victim_frame;
}

/*Using the struct provided to us, I will just keep track of dirty value bits and update as needed. I will be reusing the
 *global pointer used in fifo to keep track of which frames will be selected.
 */
int secondchance() {
	while (page_table[victim_frame].valid != 0) {
		page_table[victim_frame].valid = FALSE;
		victim_frame++;
		if (victim_frame >= size_of_memory){
			victim_frame = 0;
		}
	}
	return victim_frame;
}

/*I tried, wasn't happy so I deleted everything :c*/
void optimal() {
	printf("optimal");
}


/*
 * Super-simple progress bar.
 */
void display_progress(int percent)
{
    int to_date = PROGRESS_BAR_WIDTH * percent / 100;
    static int last_to_date = 0;
    int i;

    if (last_to_date < to_date) {
        last_to_date = to_date;
    } else {
        return;
    }

    printf("Progress [");
    for (i=0; i<to_date; i++) {
        printf(".");
    }
    for (; i<PROGRESS_BAR_WIDTH; i++) {
        printf(" ");
    }
    printf("] %3d%%", percent);
    printf("\r");
    fflush(stdout);
}


int setup()
{
    int i;

    page_table = (struct page_table_entry *)malloc(
        sizeof(struct page_table_entry) * size_of_memory
    );

    if (page_table == NULL) {
        fprintf(stderr,
            "Simulator error: cannot allocate memory for page table.\n");
        exit(1);
    }

    for (i=0; i<size_of_memory; i++) {
        page_table[i].free = TRUE;
    }

    return -1;
}


int teardown()
{

    return -1;
}


void error_resolve_address(long a, int l)
{
    fprintf(stderr, "\n");
    fprintf(stderr, 
        "Simulator error: cannot resolve address 0x%lx at line %d\n",
        a, l
    );
    exit(1);
}


int output_report()
{
    printf("\n");
    printf("Memory references: %d\n", mem_refs);
    printf("Page faults: %d\n", page_faults);
    printf("Swap ins: %d\n", swap_ins);
    printf("Swap outs: %d\n", swap_outs);

    return -1;
}


int main(int argc, char **argv)
{
    /* For working with command-line arguments. */
    int i;
    char *s;

    /* For working with input file. */
    FILE *infile = NULL;
    char *infile_name = NULL;
    struct stat infile_stat;
    int  line_num = 0;
    int infile_size = 0;

    /* For processing each individual line in the input file. */
    char buffer[MAX_LINE_LEN];
    long addr;
    char addr_type;
    int  is_write;

    /* For making visible the work being done by the simulator. */
    int show_progress = FALSE;

    /* Process the command-line parameters. Note that the
     * REPLACE_OPTIMAL scheme is not required for A#3.
     */
    for (i=1; i < argc; i++) {
        if (strncmp(argv[i], "--replace=", 9) == 0) {
            s = strstr(argv[i], "=") + 1;
            if (strcmp(s, "fifo") == 0) {
                page_replacement_scheme = REPLACE_FIFO;
            } else if (strcmp(s, "lru") == 0) {
                page_replacement_scheme = REPLACE_LRU;
            } else if (strcmp(s, "secondchance") == 0) {
                page_replacement_scheme = REPLACE_SECONDCHANCE;
            } else if (strcmp(s, "optimal") == 0) {
                page_replacement_scheme = REPLACE_OPTIMAL;
            } else {
                page_replacement_scheme = REPLACE_NONE;
            }
        } else if (strncmp(argv[i], "--file=", 7) == 0) {
            infile_name = strstr(argv[i], "=") + 1;
        } else if (strncmp(argv[i], "--framesize=", 12) == 0) {
            s = strstr(argv[i], "=") + 1;
            size_of_frame = atoi(s);
        } else if (strncmp(argv[i], "--numframes=", 12) == 0) {
            s = strstr(argv[i], "=") + 1;
            size_of_memory = atoi(s);
        } else if (strcmp(argv[i], "--progress") == 0) {
            show_progress = TRUE;
        }
    }

    if (infile_name == NULL) {
        infile = stdin;
    } else if (stat(infile_name, &infile_stat) == 0) {
        infile_size = (int)(infile_stat.st_size);
        /* If this fails, infile will be null */
        infile = fopen(infile_name, "r");  
    }


    if (page_replacement_scheme == REPLACE_NONE ||
        size_of_frame <= 0 ||
        size_of_memory <= 0 ||
        infile == NULL)
    {
        fprintf(stderr, 
            "usage: %s --framesize=<m> --numframes=<n>", argv[0]);
        fprintf(stderr, 
            " --replace={fifo|lru|optimal} [--file=<filename>]\n");
        exit(1);
    }


    setup();

    while (fgets(buffer, MAX_LINE_LEN-1, infile)) {
        line_num++;
        if (strstr(buffer, ":")) {
            sscanf(buffer, "%c: %lx", &addr_type, &addr);
            if (addr_type == 'W') {
                is_write = TRUE;
            } else {
                is_write = FALSE;
            }

            if (resolve_address(addr, is_write) == -1) {
                error_resolve_address(addr, line_num);
            }
            mem_refs++;
        } 

        if (show_progress) {
            display_progress(ftell(infile) * 100 / infile_size);
        }
    }
    

    teardown();
    output_report();

    fclose(infile);

    exit(0);
}
