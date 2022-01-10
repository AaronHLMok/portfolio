#!/usr/bin/env python3

import sys
import argparse
import datetime

#following class was written before I fully read outlines and didn't want to delete it. Please continue on ^.^
#creating objects to store dates, time etc... for asgn3
#class apmnts:
#   def _init_(self, dt_start, dt_end, loc, summ, freq):
#       self.start = dt_start
#       self.end = dt_end
#       self.location = loc
#       self.summary = sum
#       self.frequency = freq
#   def get_start(self):
#       reutrn self.start
#   def get_end(self):
#       reutrn self.end
#   def get_location(self):
#       reutrn self.location
#   def get_summary(self):
#       reutrn self.summary
#   def get_frequency(self):
#       reutrn self.frequency

# assignment #2.

#format date will make args.start/end usable for my purposes
def fmt_d(string):
    dd, mm, yy = string.split('/')
    dt = datetime.datetime(int(yy), int(mm), int(dd))
    return int(dt.strftime("%Y%m%d"))

#split and return a dictionary tuple
def sortline(string):
    if "DTSTART" in string:
        a = string.split(':', 1)
        b = {"start" : a[1].strip('\n')}
    elif "DTEND" in string:
        a = string.split(':', 1)
        b = {"end" : a[1].strip('\n')}
    elif "LOCATION" in string:
        a = string.split(':', 1)
        b = {"loc" : a[1].strip('\n')}
    elif "SUMMARY" in string:
        a = string.split(':', 1)
        b = {"summ" : a[1].strip('\n')}
    elif "RRULE" in string:
        index = string.find('UNTIL=')
        a = string[index+6:index+14]
        b = {"freq" : a.strip('\n')}
    elif "END:VEVENT" in string:
        b = 1
    else:
        return None
    return b

#copy dictionary and append
def combine(li,di):
    copy = di.copy()
    li.append(copy)
    return li

#extract year, month, day and time. extract 1 2 are aiming at days/time rather than whole string
def extract_one(time):
    yy, mo, dd = (time[0:4], time[4:6], time[6:8])
    return yy, mo, dd

#for time
def extract_two(time):
    hh, mm = (time[9:11], time[11:13])
    hh += mm
    return int(hh)

#to help compare boundaries
def extract_three(time):
    date = (time[0:8])
    return int(date)

#currently used for incrementing days
def extract_four(time):
    yy, mo, dd, hm = (time[0:4], time[4:6], time[6:8], time[9:13])
    return yy, mo, dd, hm
    

#user defined sort by date, to determine which days to print first
def sort_date(li):
    date = extract_three(li['start'])
    return int(date)

#sort by time for the order of appointments, only 'start time' is taken cause end time doesn't matter
def sort_time(li):
    time = extract_two(li['start'])
    return time

#check current date if it's within expected time period
def validity(start, end, li):
    temp = extract_three(li['start'])
    if (start <= temp <= end):
        return True
    else:
        return False

#check if freq exists
def freq_check(li):
    if 'freq' in li:
        return True
    else:
        return False

#compare exactness of days
def cmp_day(dt, li):
    if dt == extract_three(li['start']):
        return True
    else:
        return False
#determin freq maximum range
def freq_cap(li):
    if extract_three(li['start']) > int(li['freq']):
        return True
    else:
        return False

#name implies
def final_check(end, li):
    if extract_three(li['start']) > end:
        return True
    else:
        return False

#will take the extracted information passed by argument, and return a formated string with strftime()
#garbage collection sweeps up hh and mi so I can reuse extract function
def time_stamp(current_time):
    yy, mo, dd = extract_one(current_time)
    dt = datetime.datetime(int(yy), int(mo), int(dd))
    return dt.strftime("%B %d, %Y (%a)")

#function will take start/end times and returns a string matching the time
def apm_time(exact_time):
    time = extract_two(exact_time)
    if (time > 1200):
        time -= 1200
        temp = str(time)         
        if (len(temp) != 4):
            hh, mi = (temp[0:1], temp[1:3])
            temp = (" %s:%s pm" %(hh, mi))
        else:
            hh, mi = (temp[0:2], temp[2:4])
            temp = ("%s:%s pm" %(hh, mi))
    elif time <= 1200:
        temp = str(time)
        if (len(temp) != 4):
            hh, mi = (temp[0:1], temp[1:3])
            temp = (" %s:%s am" %(hh, mi))
        else:
            hh, mi = (temp[0:2], temp[2:4])
            temp = ("%s:%s am" %(hh, mi))
    return temp

#output
def output(li, abs_start, abs_end):
    ## list is SORTED!
    ql = []                                 #flush list used for printing
    walk = 0                                #determins which elemnt to start at, this is mainly to reduce run time
    temp = 0                                #to store a current date used to compare if an item should be appended to ql

    #while there are still things to print
    while (walk < len(li)):
        li.sort(key = sort_date)
        #if current walk within bounds
        if(validity(abs_start, abs_end, li[walk])):
            temp = extract_three(li[walk]['start'])
            i = walk
            j = 0
            #compare days, if match append to ql then check for freq to increment if nessary
            #else j+1 or jump a certain amount to skip days that do not have freq
            for i in range(len(li)):
                if cmp_day(temp, li[i]):
                    ql.append(li[i].copy())
                    if 'freq' in li[i]:
                        nxt_app(li[i])
                    else:
                        j += 1
                        
            #flush ql
            if ql != []:
                dash = "-" * len(time_stamp(ql[0]['start']))
                print('%s\n%s' %(time_stamp(ql[0]['start']),dash))
                for l in range(len(ql)):
                        print('%s to %s: %s [%s]' %(apm_time(ql[l]['start']), apm_time(ql[l]['end']), ql[l]['summ'], ql[l]['loc'])
                              )
            #determin how much I need to walk depending on the presense of 'freq'
            if j != 0:
                walk += j
            ql.clear()

            if not walk >= len(li):
                if freq_check(li[walk]) and freq_cap(li[walk]):
                    walk += 1
            
        #if not in range, but freq exists, increment
        elif freq_check(li[walk]):
            nxt_app(li[walk])
            if freq_cap(li[walk]):
                walk += 1
        #if not in range AND no freq, walk + 1
        elif not freq_check(li[walk]):
            walk += 1
            
    return None

#will increment day for the next appointment, assumption is that freqs are weekly appointments.
#can be modified simply by adding another argument into function which accepts days incremented
#and use that as refference. The '00' are the seconds, just to keep things consistant
#check if freq within bounds
def nxt_app(li):
    yy, mo, dd, hm = extract_four(li['start'])
    cur_app = datetime.datetime(int(yy), int(mo), int(dd))
    tdelta = datetime.timedelta(days=7)
    next_app = cur_app + tdelta
    li['start'] = next_app.strftime("%Y%m%d") + 'T' + hm + '00'
    return None

# The code below configures the argparse module for use with
def main():
    parser = argparse.ArgumentParser()
    parser.add_argument('--file', type=str, help='file to be processed')
    parser.add_argument('--start', type=str, help='start of date range')
    parser.add_argument('--end', type=str, help='end of data range')

    args = parser.parse_args()

    if not args.file:
        print("Need --file=<ics filename>")

    if not args.start:
        print("Need --start=dd/mm/yyyy")

    if not args.end:
        print("Need --end=dd/mm/yyyy")

    ##########start from here##########
    #format args.start/end into yyyymmdd so I can compare
    abs_start = fmt_d(args.start)               #absolute start (start argument basically) into an int
    abs_end = fmt_d(args.end)                   #end argument into an int

    f = open(args.file, "r")
    readline = f.readlines()
    li = []                                     #list to store all data
    di = {}                                     #using this as a temp storage dictionary to sort

    for line in readline:
        if (sortline(line) == None):
            continue
        elif (sortline(line) == 1):
            combine(li,di)
            di.clear()
        elif (sortline(line) != None):
            di.update(sortline(line))
            
    f.close()
    
    ##update##
    #program still uses a list of dicts. The idea behinde this method is mostly abusing the fact things are sorted
    #and can be iterated. The following will be a layout of how the program runs
    #for i in list, check first element to see if it's within argument.
    #if true, appending to a 'flush list', else if not in range but RRULE exists, increment and try again
    #the walk will increase each time a certain condition is met for example, the current 'walk' has reached it's
    #end date, move onto next or no RRULE, move onto next.
    #test 15 still fails
    output(li, abs_start, abs_end)

if __name__ == "__main__":
    main()
