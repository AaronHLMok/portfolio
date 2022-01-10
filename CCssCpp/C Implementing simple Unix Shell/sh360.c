/*
Written by Aaron Mok
V00924998
Summary: 
Assumes .sh360rc exists within same folder. Will print error if none detected.
*/

#include <stdlib.h>
#include <stdio.h>
#include <sys/wait.h>
#include <sys/types.h>
#include <sys/stat.h>
#include <unistd.h>
#include <string.h>
#include <assert.h>
#include <fcntl.h>

#define MAX_INPUT_LINE 80
#define MAX_LENGTH 10

/*prototype*/
void input_bound(char(*paths)[MAX_INPUT_LINE], int p);
void ncut(char* s);
int read_input(char** param, char* input, int* i);
void gotta_fork(int i, char(*path)[MAX_INPUT_LINE], char** param, int p, int pp_or);
void build(char* pa, char* pm, char *tm);
void norm_fork(char** a, char** e, int pn, char* cmd, char(*paths)[MAX_INPUT_LINE]);
void pp_stage(int n, char** e, int pn, char(*paths)[MAX_INPUT_LINE], char ** params);
void pp_fork(int p, char** h, char** b, char** t, char(*paths)[MAX_INPUT_LINE], int pn, char** envp, char** cmd_store);
void or_fork(int n, char** e, int pn, char* cmd, char(*paths)[MAX_INPUT_LINE], char** params);

/*
 *The prompt function takes stripped first line from .sh360rc and displays it as our promt. From here, it will take in
 *user input. 
 */
void promt(char (*paths)[MAX_INPUT_LINE], char *pmt, int path_num) {
	for (;;) {
		fprintf(stdout, "%s> ", pmt);
		fflush(stdout);
		input_bound(paths, path_num);
	}
}

/*
 *This section is when input is detected and processing beings. Will assert that input is < 80. No input detected will return to promt.
 *nums is the amount of parameters detected in input. PLEASE NOTE: I have taken the 'parameters' as individual inputs recieved from
 *stdin, not including OR/PP commands, eg: ls -la -F is concidered 3 arguments. At the moment, this detection has been turned off for testing
 *the pipe command PP ps aux -> grep root -> wc -l. If you wish to test, please uncomment starting at line 64-68.
 *when info gathering has finished, gotta_fork() will begin the fork() sessions.
 */
void input_bound(char(*paths)[MAX_INPUT_LINE], int path_num) {
	char input[MAX_INPUT_LINE + 1];
	char* param[MAX_INPUT_LINE];
	int pp_or = 0;
	ncut(fgets(input, MAX_INPUT_LINE + 1, stdin));
	assert(strlen(input) < MAX_INPUT_LINE);

	if (strlen(input) == 0) {
		return;
	}

	int nums = read_input(param, input, &pp_or);

	/*Parameter limit, can be removed.*/
	/*if (nums > 7) {
		printf("Parameters exceed 7, please try again.\n");
		return;
	}
	else*/ 
	if (nums == -1) {
		fprintf(stderr, "Missing '->'. Please try again.\n");
		return;
	}

	gotta_fork(nums, paths, param, path_num, pp_or);
}

/*
 *Three possible routes, normal = 0, OR = 1, PP = 2. This is determined by pp_or.
*/
void gotta_fork(int nums, char(*paths)[MAX_INPUT_LINE], char** params, int path_num, int pp_or) {
	char* args[MAX_INPUT_LINE] = {};
	char* envp[] = { 0 };
	char* cmd = params[0];
	int i = 0;

	switch (pp_or) {
		case 1 :
			or_fork(nums, envp, path_num, cmd, paths, params);
			break;

		case 2 :
			pp_stage(nums, envp, path_num, paths, params);
			break;

		default :
			for (int i = 1; i < nums; i++) {
				args[i] = params[i];
			}
			norm_fork(args, envp, path_num, cmd, paths);
	}
}

/*
 *Ease of use, insead of calling this multiple times.
 */
void run_the_child(char* temp, char** args, char** env) {
	execve(temp, args, env);
}

/*
 *Modified version of appendix b. Will run through the list of possible paths in .sh360rc and print error if no vaild paths.
 *everything is formatted it first before passing to execve().
 */
void norm_fork(char **args, char** envp, int path_num, char *cmd, char(*paths)[MAX_INPUT_LINE]) {
	int pid, status;

	if ((pid = fork()) == 0) {
		char temp_path[MAX_INPUT_LINE];

		for (int i = 0; i <= path_num; i++) {
			if (i == path_num) {
				fprintf(stderr, "No valid path found\n");
				exit(1);
			}
			build(paths[i], cmd, temp_path);
			args[0] = temp_path;
			run_the_child(args[0], args, envp);
		}
	}
	waitpid(pid, &status, 0);
}

/*
 *Next two functions are modified versions of appendix d. Staging is setting up formats to make calls later. Please note, this uses at most
 *2 pipes. 3rd pipe and beyond will be ignored. eg: 'ls -> ls -> ls' will be vaild but 'ls -> ls -> ls -> ls' will not.
 */
void pp_stage(int nums, char** envp, int path_num, char(*paths)[MAX_INPUT_LINE], char ** params) {
	char* args[MAX_INPUT_LINE] = {};
	char* arg_mid[MAX_INPUT_LINE] = {};
	char* arg_tail[MAX_INPUT_LINE] = {};
	char* cmd_store[] = { 0,0,0 };
	cmd_store[0] = params[0];
	int s = 0;
	int r = 1;

	for (int i = 1; i < nums; i++) {
		if (strcmp(params[i], "->") == 0) {
			s++;
			r = 1;
			if (i + 1 >= nums) {
				fprintf(stderr, "Missing commands after '->'\n");
				return;
			}

			i++;
			if (strcmp(params[i], "->") == 0) {
				fprintf(stderr, "Ivalid command after '->'.\n");
				return;
			}	
			cmd_store[s] = params[i];
			continue;
		}

		switch (s) {
			case 1 :
				arg_mid[r] = params[i];
				break;
			case 2 :
				arg_tail[r] = params[i];
				break;
			default :
				args[r] = params[i];
		}
		r++;
	}
	pp_fork(s, args, arg_mid, arg_tail, paths, path_num, envp, cmd_store);
}

/*
 *Oh man did this give me a headache haha... 
 *Modified version of appendix d, and continuation from above. Pipes are created and used here. Pipe_nums determins the amount of pipes
 *detected from earlier, to a maximum of two. 
 */
void pp_fork(int pipe_num, char** head, char** body, char** tail, char(*paths)[MAX_INPUT_LINE], int path_num, char** envp,char** cmd_store) {
	int status, pid_head, pid_body, pid_tail;
	int fd[2];
	int pd[2];

	pipe(fd);

	if (pipe_num == 2) {
		pipe(pd);
	};

	if ((pid_head = fork()) == 0) {
		char temp_patha[MAX_INPUT_LINE];
		for (int i = 0; i < path_num; i++) {
			dup2(fd[1], 1);
			close(fd[0]);
			build(paths[i], cmd_store[0], temp_patha);
			head[0] = temp_patha;
			run_the_child(temp_patha, head, envp);
		}
	}
	
	if ((pid_body = fork()) == 0) {
		char temp_pathb[MAX_INPUT_LINE];
		for (int i = 0; i < path_num; i++) {
			dup2(fd[0], 0);
			close(fd[1]);
			if (pipe_num == 2) {
				dup2(pd[1], 1);
				close(pd[0]);
			}
			build(paths[i], cmd_store[1], temp_pathb);
			body[0] = temp_pathb;
			run_the_child(temp_pathb, body, envp);
		}
	}

	close(fd[0]);
	close(fd[1]);

	if (pipe_num == 2) {
		if ((pid_tail = fork()) == 0) {
			char temp_pathc[MAX_INPUT_LINE];
			dup2(pd[0], 0);
			close(pd[1]);
			for (int i = 0; i < path_num; i++) {
				build(paths[i], cmd_store[2], temp_pathc);
				tail[0] = temp_pathc;
				run_the_child(temp_pathc, tail, envp);
			}
		}
	}

	waitpid(pid_head, &status, 0);
	printf("head done\n");
	if (pipe_num == 2) {
		close(pd[0]);
		close(pd[1]);
	}
	waitpid(pid_body, &status, 0);
	printf("body done\n");
	if (pipe_num == 2) {
		waitpid(pid_tail, &status, 0);
		printf("tail done\n");
	}

}

/*
 *Modified version of appendix C. When OR detected, print out to file. Please note, anything after the filename discarded. 
 *Eg: 'ls -> out.txt abc', parameter abc will be thrown away but we still write to out.txt
 */
void or_fork(int nums, char** envp, int path_num, char* cmd, char(*paths)[MAX_INPUT_LINE], char ** params) {
	char* fname[MAX_INPUT_LINE] = {};
	char* args[MAX_INPUT_LINE] = {};
	int pid, fd;
	int status;

	for (int i = 1; i < nums; i++) {
		if (strcmp(params[i], "->") == 0) {
			if (i + 1 >= nums) {
				fprintf(stderr, "Missing file name after '->'.\n");
				return;
			}

			i++;
			if (strcmp(params[i], "->") == 0) {
				fprintf(stderr, "Invalid file name.\n");
				return;
			}
			fname[0] = params[i];
			continue;
		}
		args[i] = params[i];
	}

	if ((pid = fork()) == 0) {
		char temp_path[MAX_INPUT_LINE];

		fd = open(fname[0], O_CREAT | O_RDWR, S_IRUSR | S_IWUSR);
		if (fd == -1) {
			fprintf(stderr, "error writing to file\n");
			exit(1);
		}

		dup2(fd, 1);
		dup2(fd, 2);

		for (int i = 0; i <= path_num; i++) {
			if (i == path_num) {
				fprintf(stderr, "No valid path found\n");
				exit(1);
			}
			build(paths[i], cmd, temp_path);
			args[0] = temp_path;
			run_the_child(temp_path, args, envp);
		}
	}
	waitpid(pid, &status, 0);
}

/*
 *Simple formatting for execv(). Will correct extra '/' characters.
 */
void build(char *pa, char *pm, char* temp) {
	if (pa[strlen(pa) - 1] != '/') {
		strncat(pa, "/", 2);
		strncat(pa, pm, MAX_INPUT_LINE);
		strncpy(temp, pa, MAX_INPUT_LINE);
	}
	else {
		strncat(pa, pm, MAX_INPUT_LINE);
		strncpy(temp, pa, MAX_INPUT_LINE);
	}
}

/*
 *Reads from .sh360rc, will print error when file is not found. Takes the first line and modifies it to char *pmt to be used as our prompt
 *message. Returns the number of paths found within the file.
 */
int read_rc(char (*paths)[MAX_INPUT_LINE], char *pmt) {
	char buffer[MAX_INPUT_LINE];
	int num;

	FILE* f;
	f = fopen(".sh360rc", "r");
	if (f == NULL) {
		fprintf(stderr, ".sh360rc could not be found.");
		exit(1);
	}
	
	ncut(fgets(pmt, MAX_LENGTH, f));

	while (fgets(buffer, MAX_INPUT_LINE, f) !=NULL){
		ncut(buffer);
		strncpy(paths[num], buffer, MAX_INPUT_LINE);
		num++;
	}

	fclose(f);

	return num;

}

/*
 *Starts gathering info on input provided by user. If exit is the only command then program will exit. Param[] will be modified here.
 *Strtok is used to split input into array for later use. PP/OR options are excluded from this, instead a simple flag is used to determin
 *which special command we may intend to use, indicated by pp_or(). As mentioned above, when num == 7, this indicates that parameters
 *have exceeded 7, will return right away and error will be printed out by input_bound(); arrow_flags are used to determin corectness of
 *user input. 
 */
int read_input(char **param, char *input, int *pp_or) {
	char* t;
	char buff[MAX_INPUT_LINE];
	int num = 0;
	int arrow_flag = 0;

	t = strtok(input, " ");
	if (strcmp(t, "PP") == 0) {
		t = strtok(NULL, " ");
		*pp_or = 2;
		arrow_flag = 1;
	} else if (strcmp(t, "OR") == 0) {
		t = strtok(NULL, " ");
		*pp_or = 1;
		arrow_flag = 1;
	}

	while (t != NULL) {
		if (num > 7) {
			return num;
		}

		if (strcmp(t, "->") == 0) {
			arrow_flag = 0;
		}

		strncpy(buff, t, MAX_LENGTH);
		param[num] = t;
		t = strtok(NULL, " ");
		num++;
	}

	if (num == 1) {
		if (strcmp(param[0], "exit") == 0){
			printf("Exiting...\n");
			exit(0);
		}
	}

	if (arrow_flag != 0) {
		return -1;
	}

	return num;
}

/*
 *strips the \n character when called
 */
void ncut(char *s) {
	if (s[strlen(s) - 1] == '\n') {
		s[strlen(s) - 1] = '\0';
	}
}

int main(int argc, char *argv[]) {
	char paths[MAX_INPUT_LINE][MAX_INPUT_LINE];
	char pmt[MAX_LENGTH];

	int path_num = read_rc(paths, pmt);
	promt(paths, pmt, path_num);

	exit(0);
}