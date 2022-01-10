#!usr/bin/env python
#Aaron Mok

import os
def main():
    os.system('./virtmem --framesize=12 --numframes=140 --replace=fifo --file=traces/hello_out.txt')
    os.system('./virtmem --framesize=12 --numframes=120 --replace=fifo --file=traces/hello_out.txt')
    os.system('./virtmem --framesize=12 --numframes=100 --replace=fifo --file=traces/hello_out.txt')
    os.system('./virtmem --framesize=12 --numframes=75 --replace=fifo --file=traces/hello_out.txt')
    os.system('./virtmem --framesize=10 --numframes=50 --replace=fifo --file=traces/hello_out.txt')
    os.system('./virtmem --framesize=8 --numframes=25 --replace=fifo --file=traces/hello_out.txt')
    os.system('./virtmem --framesize=4 --numframes=10 --replace=fifo --file=traces/hello_out.txt')

    os.system('./virtmem --framesize=12 --numframes=140 --replace=lru --file=traces/ls_out.txt')
    os.system('./virtmem --framesize=12 --numframes=120 --replace=lru --file=traces/ls_out.txt')
    os.system('./virtmem --framesize=12 --numframes=100 --replace=lru --file=traces/ls_out.txt')
    os.system('./virtmem --framesize=12 --numframes=75 --replace=lru --file=traces/ls_out.txt')
    os.system('./virtmem --framesize=10 --numframes=50 --replace=lru --file=traces/ls_out.txt')
    os.system('./virtmem --framesize=8 --numframes=25 --replace=lru --file=traces/ls_out.txt')
    os.system('./virtmem --framesize=4 --numframes=10 --replace=lru --file=traces/ls_out.txt')

    os.system('./virtmem --framesize=12 --numframes=140 --replace=secondchance --file=traces/matrixmult_out.txt')
    os.system('./virtmem --framesize=12 --numframes=120 --replace=secondchance --file=traces/matrixmult_out.txt')
    os.system('./virtmem --framesize=12 --numframes=100 --replace=secondchance --file=traces/matrixmult_out.txt')
    os.system('./virtmem --framesize=12 --numframes=75 --replace=secondchance --file=traces/matrixmult_out.txt')
    os.system('./virtmem --framesize=10 --numframes=50 --replace=secondchance --file=traces/matrixmult_out.txt')
    os.system('./virtmem --framesize=8 --numframes=25 --replace=secondchance --file=traces/matrixmult_out.txt')
    os.system('./virtmem --framesize=4 --numframes=10 --replace=secondchance --file=traces/matrixmult_out.txt')

    print("done!")


if __name__ == '__main__':
    main()