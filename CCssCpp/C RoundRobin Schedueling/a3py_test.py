#!/usr/bin/env python

# By Aaron Mok V00924998
# Assignment 3 pytest

import os

def main():
    os.system('mkdir datafolder')

    os.system('./simgen 1000 1337 | ./rrsim --quantum 50 --dispatch 0 > datafolder/data0.txt')
    os.system('./simgen 1000 1337 | ./rrsim --quantum 50 --dispatch 5 > datafolder/data1.txt')
    os.system('./simgen 1000 1337 | ./rrsim --quantum 50 --dispatch 10 > datafolder/data2.txt')
    os.system('./simgen 1000 1338 | ./rrsim --quantum 50 --dispatch 15> datafolder/data3.txt')
    os.system('./simgen 1000 1338 | ./rrsim --quantum 50 --dispatch 20 > datafolder/data4.txt')
    os.system('./simgen 1000 1337 | ./rrsim --quantum 50 --dispatch 25 > datafolder/data5.txt')

    os.system('./simgen 1000 1337 | ./rrsim --quantum 100 --dispatch 0 > datafolder/data6.txt')
    os.system('./simgen 1000 1337 | ./rrsim --quantum 100 --dispatch 5 > datafolder/data7.txt')
    os.system('./simgen 1000 1337 | ./rrsim --quantum 100 --dispatch 10 > datafolder/data8.txt')
    os.system('./simgen 1000 1337 | ./rrsim --quantum 100 --dispatch 15 > datafolder/data9.txt')
    os.system('./simgen 1000 1339 | ./rrsim --quantum 100 --dispatch 20 > datafolder/data10.txt')
    os.system('./simgen 1000 1337 | ./rrsim --quantum 100 --dispatch 25 > datafolder/data11.txt')

    os.system('./simgen 1000 1337 | ./rrsim --quantum 250 --dispatch 0 > datafolder/data12.txt')
    os.system('./simgen 1000 1337 | ./rrsim --quantum 250 --dispatch 5 > datafolder/data13.txt')
    os.system('./simgen 1000 1337 | ./rrsim --quantum 250 --dispatch 10 > datafolder/data14.txt')
    os.system('./simgen 1000 1337 | ./rrsim --quantum 250 --dispatch 15 > datafolder/data15.txt')
    os.system('./simgen 1000 1337 | ./rrsim --quantum 250 --dispatch 20 > datafolder/data16.txt')
    os.system('./simgen 1000 1337 | ./rrsim --quantum 250 --dispatch 25 > datafolder/data17.txt')

    os.system('./simgen 1000 1337 | ./rrsim --quantum 500 --dispatch 0 > datafolder/data18.txt')
    os.system('./simgen 1000 1337 | ./rrsim --quantum 500 --dispatch 5 > datafolder/data19.txt')
    os.system('./simgen 1000 1337| ./rrsim --quantum 500 --dispatch 10 > datafolder/data20.txt')
    os.system('./simgen 1000 1337 | ./rrsim --quantum 500 --dispatch 15 > datafolder/data21.txt')
    os.system('./simgen 1000 1337 | ./rrsim --quantum 500 --dispatch 20 > datafolder/data22.txt')
    os.system('./simgen 1000 1337 | ./rrsim --quantum 500 --dispatch 25 > datafolder/data23.txt')

    print("Done!")


if __name__ == '__main__':
    main()