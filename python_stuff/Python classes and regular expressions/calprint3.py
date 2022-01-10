import sys
import argparse
import datetime
import re
import copy

#####classes######
#class appointment will store and retrieve data
#   freq by default will be None
#   valid is to see if the current appointment should be included
class appointments:
    def _init_(self, dt_start, dt_end, loc, summ, freq, valid):
       self.start = dt_start
       self.end = dt_end
       self.location = loc
       self.summary = summ
       self.frequency = freq
       self.valid = valid
    def get_start(self):
       return self.start
    def get_end(self):
       return self.end
    def get_location(self):
       return self.location
    def get_summary(self):
       return self.summary
    def get_frequency(self):
       return self.frequency
    def get_valid(self):
        return self.valid

#class Calprint is needed when being called by tester3_alt.py
#   An empty list is created to store all data
#   read_this will sort the file argument passed by tester and gather any relavent information
#   General overview is, information comes in and sorts it. When tester3_alt.py calls the get_events_for_day fuction
#   it will take the additional datetime objected passed, convert it to a comparable integer and returns 'output'
#   details on 'output' methoad will be below
class Calprint:
    def __init__(self, file):
        self.filename = file
        self.li = []
        read_this(self.filename, self.li)
        self.li.sort(key = sort_date)
    def get_events_for_day(self, curr_dt):
        curr_dt = ext_five(curr_dt)
        return output(self.li, curr_dt)
    
#####sorting#####
#sortline takes in a single line, a list and index refering to which cell is currently being worked on
#when DT:START is detected, create a new empty appointments and append to current list
#when END:VEVENT is found, return a 1 and increment index indicating that current appointment
#has no more additional usefull information
def sortline(string, app, i):
    #####bunch of regex#####
    rstart = r'DTSTART:(\d*T\d*)'
    rend   = r'DTEND:(\d*T\d*)'
    rloc   = r'LOCATION:(...*)'
    rsum   = r'SUMMARY:(...*)'
    rrule  = r'RRULE:.+UNTIL=(\d*)T\d+'
    revd   = r'END:VEVENT'
    
    if re.search(rstart, string):
        app.append(appointments())
        m = re.search(rstart, string)
        app[i].start = m.group(1)
        app[i].valid = True
    elif re.search(rend, string):
        m = re.search(rend, string)
        app[i].end = m.group(1)
    elif re.search(rloc, string):
        m = re.search(rloc, string)
        app[i].location = m.group(1)
    elif re.search(rsum, string):
        m = re.search(rsum, string)
        app[i].summary = m.group(1)
    elif re.search(rrule, string):
        m = re.search(rrule, string)
        app[i].frequency = int(m.group(1))
    elif re.search(revd, string):
        if not hasattr(app[i], 'frequency'):
            app[i].frequency = False
        return 1
    return None

#read_this function will read oneline, and pass it off to sorting to deal with comparison
def read_this(file, li):
    f = open(file, "r")
    readline = f.readlines()
    i = 0

    #read line by line, and sort data accordingly please see method for more details#
    for line in readline:
        if (sortline(line, li, i) == None):
            continue
        elif (sortline(line, li, i) == 1):
            i += 1
        elif (sortline(line, li, i) != None):
            sortline(line, li, i)
    f.close()
    return li

#sort_date will create a key used to sort list by date
def sort_date(li):
    date = ext_one(li.start)
    return int(date)

#####Time#####
#time_stamp will return a formated year, month and day
#ap_time will create time object and return a string corresponding to specific time
#   ap_time will also trim the zero padded time if it's past noon
#format date will turn args.start/end into an integer
def time_stamp(time):
    yy, mo, dd = ext_two(time)
    dt = datetime.datetime(int(yy), int(mo), int(dd))
    return dt.strftime("%B %d, %Y (%a)")

def ap_time(time):
    hr, mm = ext_three(time)
    c = datetime.time(int(hr), int(mm))
    temp = (c.strftime("%I:%M %p"))
    if re.search(r'^[0]', temp):
        temp = re.sub(r'^[0]', ' ', temp)  
    return temp

#####extract#####
#ext_one will return first 8 numbers of the argument string
#ext_two will return year month and date as two character strings
#ext_three will return hour and minuite for time
#ext_four will use ext_two/three to seperate a time string, create a new datetime object, uses that to increment by
#   seven days. After incrementing, append everything back together, modify li[i] to reflect the changes and return it
#ext_five strictly deals with formatting the datetime object passed from tester3_alt.py and returns an integer for comparisons
def ext_one(time):
    m = re.match(r'^[0-9]{8}', time)
    date = m.group(0)
    return date

def ext_two(time):
    m = re.search(r'(.{4})(.{2})(.{2})', time)
    yy, mo, dd = (m.group(1), m.group(2), m.group(3))
    return yy, mo, dd

def ext_three(time):
    m = re.search(r'^\d+\w(\d{2})(\d{2})', time)
    hr, mm = (m.group(1), m.group(2))
    return hr, mm

def ext_four(li):
    yy, mo, dd = ext_two(li.start)
    hr, mm = ext_three(li.start)
    tdelta = datetime.timedelta(days=7)
    cur_app = datetime.datetime(int(yy), int(mo), int(dd))
    nxt_app = cur_app + tdelta
    li.start = nxt_app.strftime("%Y%m%d") + 'T' + hr + mm + '00'
    return li

def ext_five(time):
    t = time.strftime("%Y%m%d")
    t = re.sub(r'\s...+', '', t)
    t = re.sub(r'-', '', t)
    return int(t)

#####bounds#####
#update will increase li.start by 7 days. Note that 'valid' in this context is when the appointment is still relavent
#   when the appointment validity is false, skip the said appointment
#freq_check checks if an appointment will repeat
def update(li):
    if li.frequency == False:
        li.valid = False
        return li
    else:
        ext_four(li)
        return li

def freq_check(li):
    cfreq = int(ext_one(li.start))
    if cfreq <= int(li.frequency):
        return True
    else:
        li.valid = False
        return li

#####output#####
#after everything is set up, output will bring everything together. Similar to A2, temp will hold a string
#ql is used to store and flush out stored appointments on a said day. sad_flag is just there.
#the first i loop is used to keep any appointments up to date, or place the appointment within boundary of the argument
#if freq exists. While the function goes on, it will check validity of a given appointment and determins if it needs to be skipped or
#updated. The second l loop is used to append to any additional appointsments of the same day onto temp, then return temp back
def output(li, curr_dt):
    temp = ''
    ql = []
    sad_flag = True
    
    for i in range(len(li)):
        if int(ext_one(li[i].start)) < curr_dt:
            while int(ext_one(li[i].start)) < curr_dt and li[i].valid:
                if li[i].valid == False:
                    continue
                else:
                    update(li[i])
                    freq_check(li[i])
        
        if int(ext_one(li[i].start)) == curr_dt:
            if li[i].valid == False:
                continue
            else:
                ql.append(copy.deepcopy(li[i]))
                update(li[i])
                freq_check(li[i])

    if ql !=[]:
        dash = "-" * len(time_stamp(ql[0].start))
        temp = ('%s\n%s\n' %(time_stamp(ql[0].start), dash))
        for l in range(len(ql)):
            temp += ('%s to %s: %s [%s]\n' %(ap_time(ql[l].start).lower(), ap_time(ql[l].end).lower(), ql[l].summary, ql[l].location))
        temp = re.sub(r'$\n', '', temp)

    ql.clear()                    
    return temp
    
if __name__ == "__main__":
    main()
