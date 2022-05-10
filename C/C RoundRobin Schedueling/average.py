#!/usr/bin/env python

import re
import os
'''
NOTE! This assumes a3py_test.py has been ran and there exists
a)a folder called 'Datafolder' and b)there are 24 text files in that folder
'''

def loop(start,end, quantum):
    average_w = [0] * 6
    average_ta = [0] * 6
    ext = r'w=(\d*.\d*) ta=(\d*.\d*)'
    exit_count = 0
    temp = 0
    g = open("outcome.txt", "a")

    for x in range(start, end):
        f = open("datafolder/data{}.txt".format(x), "r")
        lines = f.readlines()
        for line in lines:
            if "EXIT" in line:
                m = re.search(ext, line)
                average_w[temp] += float(m.group(1))
                average_ta[temp] += float(m.group(2))
                exit_count+=1

        average_w[temp] = average_w[temp]/exit_count
        average_ta[temp] = average_ta[temp]/exit_count
        exit_count = 0
        temp+=1
        f.close()

    for x in range (0, 6):
        g.write("===Dispatch {} and Quantum {}===\n".format(x*5, quantum))
        g.write("wait average      : {}".format(average_w[x]) + '\n')
        g.write("turnaround average: {}".format(average_ta[x]) + '\n')
    g.write("\n")
    g.close


def main():
    os.system('rm outcome.txt')
    loop(0, 6, 50)
    loop(6, 12, 100)
    loop(12, 18, 250)
    loop(18, 24, 500)
    print("Done!")


if __name__ == '__main__':
    main()
