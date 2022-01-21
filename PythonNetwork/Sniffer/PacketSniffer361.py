# By Aaron Mok V00924998
# Assignment 1
# !/bin/env python

import sys
from basic_structures import *
from struct import *

#Class info box stores most information used for comparisions
class info_box:
    src_addr = None
    dest_addr = None
    src_port = None
    dest_port = None
    stat_s = 0
    stat_f = 0
    st_time = 0
    ed_time = 0
    duration = 0
    pkt_src2dest = 0
    pkt_dest2src = 0
    byte_src2dest = 0
    byte_dest2src = 0
    debug_line = 0
    status_flag = None

    def __init__(self):
        self.src_addr = None
        self.dest_addr = None
        self.src_port = None
        self.dest_port = None
        self.start_time = None
        self.end_time = None
        self.duration = None
        self.status_flag = None
        self.pkt_dest2src = 0
        self.pkt_src2dest = 0
        self.byte_src2dest = 0
        self.byte_dest2src = 0
        self.byte_len = 0
        self.stat_s = 0
        self.stat_f = 0

    def add_debug_line(self):
        self.debug_line += 1

    def get_addr(self):
        return self.src_addr, self.dest_addr

    def addr_set(self, src, dest):
        self.src_addr = src
        self.dest_addr = dest

    def port_set(self, src, dest):
        self.src_port = src
        self.dest_port = dest

    def flag_set(self, flags):
        self.status_flag = flags

    def start_time_set(self, st):
        self.start_time = st

    def end_time_set(self, ed):
        self.end_time = ed

    def src_bytes_set(self, bstd):
        self.byte_src2dest += bstd

    def dest_bytes_set(self, bdts):
        self.byte_dest2src += bdts

    def byte_len_set(self, bitties):
        self.byte_len = bitties

    def pkt_src2dest_add(self):
        self.pkt_src2dest += 1

    def pkt_dest2src_add(self):
        self.pkt_dest2src += 1

    def set_s(self):
        self.stat_s += 1

    def set_f(self):
        self.stat_f += 1

#handels incorrect input
def main():
    if len(sys.argv) != 2:
        print("Incorrect input, please try again")
        exit(0)
    try:
        f = open(sys.argv[1], 'rb')
    except OSError:
        print("unable to open {}".format(sys.argv[1]))
        exit(1)

    read_cap(f)
    f.close()

#read cap file, when end of cap file break out. Hand list to function
def read_cap(file_f):
    file_f.read(24)
    temp_list = list()

    while file_f:
        try:
            i = packet_header_read(file_f.read(16))
        except struct.error:
            break

        temp_list.append(packet_data_read(file_f.read(i)))

    process_me(temp_list)

#Reads packet header for incl len, used for reading x bytes for packet data
def packet_header_read(file_f):
    ts_sec, ts_usec, incl_len, orig_len = unpack('IIII', file_f)
    return incl_len


#Reads packet data and stores relavent information into info_box() class#
def packet_data_read(file_f):
    # ipv4#
    p = IP_Header()
    p.get_header_len(file_f[14:15])
    p.get_total_len(file_f[16:18])
    p.get_IP(file_f[26:30], file_f[30:34])
    iphl = p.ip_header_len - 20

    # tcp data-offset here already in bytes.#
    temp_tcp = file_f[34 + iphl:]
    tp = TCP_Header()
    tp.get_src_port(temp_tcp[0:2])
    tp.get_dst_port(temp_tcp[2:4])
    tp.get_seq_num(temp_tcp[4:8])
    tp.get_ack_num(temp_tcp[8:12])
    tp.get_data_offset(temp_tcp[12:13])
    tp.get_flags(temp_tcp[13:14])
    tp.get_window_size(temp_tcp[14:15], temp_tcp[15:16])

    return merge_info(p, tp)


# merge info merges information from ip and tcp +14 is for the ethernet header#
def merge_info(p, tp):
    temp = info_box()
    temp.addr_set(p.src_ip, p.dst_ip)
    temp.port_set(tp.src_port, tp.dst_port)
    temp.byte_len_set(p.total_len + 14)
    temp.flag_set(tp.flags)
    if tp.flags['SYN'] == 1:
        temp.set_s()
    if tp.flags['FIN'] == 1:
        temp.set_f()

    return temp


#Logic part of the code, also keeps track of connections and resets. Uses 4 tuples to check ip and ports, then matches
#to corresponding send and reciever. After logic, pass information to print section.
def process_me(box):
    connection_info = []
    current_connections = list()
    connection_count = 0
    complete = 0
    incomplete = 0
    resets = 0

    # compare 4tuple
    for i in box:
        if i.status_flag['RST'] == 1:
            resets += 1

        temp_4tuple_a = (i.src_addr, i.src_port, i.dest_addr, i.dest_port)
        temp_4tuple_b = (i.dest_addr, i.dest_port, i.src_addr, i.src_port)

        # if 4tuple found, find index to that tuple, then modify information
        if temp_4tuple_a in current_connections or temp_4tuple_b in current_connections:
            index = find_box(temp_4tuple_a, temp_4tuple_b, connection_info)

            # combine info#
            connection_info[index] = combine(connection_info[index], i)

        # if no tuple found, add to list of tuples
        else:
            current_connections.append(temp_4tuple_a)
            connection_info.append(i)
            connection_count += 1

    for i in connection_info:
        if(i.stat_f >= 1 and i.stat_s >= 1):
            complete += 1

    incomplete = connection_count - complete

    output_a(connection_count, connection_info)
    output_b(complete, resets,incomplete)
    #output_c(connection_info)


#matches sorce1 to dest2 for two info_box() classes
def find_box(tu1, tu2, box):
    for i in range(len(box)):
        temp = (box[i].src_addr, box[i].src_port, box[i].dest_addr, box[i].dest_port)
        if tu1 == temp or tu2 == temp:
            return i

#combines information as on collective for two of the same ip/port send/reciever.
def combine(box1, box2):
    # src to dest
    if box2.src_addr == box1.src_addr:
        box1.pkt_src2dest_add()
        box1.src_bytes_set(box1.byte_len)

    # dest to src
    else:
        box1.pkt_dest2src_add()
        box1.dest_bytes_set(box1.byte_len)

    if box2.stat_s:
        box1.set_s()
    if box2.stat_f:
        box1.set_f()
    return box1

#print out
def output_a(con_count, cl):
    print("A) Total number of connections\nTotal number of connections: {}\n".format(con_count))
    print("Connection details:")
    count = 1

    print("B) Connection Details")
    for i in cl:
        print("Connection:{}\nSource Address:{}\nDestination address:{}\nSource Port:{}\nDestination Port:{}".format(
            count, i.src_addr, i.dest_addr, i.src_port, i.dest_port))
        count += 1

        if (i.stat_s >=2 and i.stat_f >=2):
            print("Status: Complete")
            print("Start time:{}\nEnd Time:{}\nDuration:{}\nNumber of packets sent from Soruce to Destination:{}\n"
                  "Number of packets sent from Destination to source:{}\nTotal number of packets:{}\n"
                  "Number of data bytes sent from Source to Destination:{}\n"
                  "Number of data bytes sent from Destination to Source:{}\nTotal data bytes{}\n".format(
                i.st_time, i.ed_time, (i.ed_time - i.st_time), i.pkt_src2dest, i.pkt_dest2src,
                (i.pkt_src2dest + i.pkt_dest2src), i.byte_src2dest, i.byte_dest2src,
                (i.byte_src2dest + i.byte_dest2src)))
        else:
            print("Status: Incomplete")
        print("END\n")

#print out
def output_b(complete, resets, incomplete):
    print("C) General\nTotal number of complete TCP connections: {}\nNumber of Resets: {}\nNumber of open TCP left: {}"
          .format(complete, resets, incomplete))
    return

#let range start at 1, if any value larger or smaller, replace.
def out_put_c(info):
    min_time = 0
    mean_time = 0
    max_time = 0
    min_rtt = 0
    mean_rtt = 0
    max_rtt = 0
    min_packet = 0
    max_packet = 0
    mean_packet = 0
    min_window = 0
    max_window = 0
    mean_window = 0
    print("D) Complete TCP Connections:\n")


if __name__ == '__main__':
    try:
        main()
    except KeyboardInterrupt:
        print('Exiting')
        exit(0)

# Code below was to play around with the other headers, please ignore.#
# I for 4 byte unsigned int and H for 2bite unsigned int
# def global_header_read(file_f):
#     magic_n, major_ver, minor_ver, zone, sigfigs, snaplen, network = unpack('IHHIIII', file_f)
#     print("{}\n{}\n{}\n{}\n{}\n{}\n{}\n".format(magic_n,major_ver,minor_ver,zone,sigfigs,snaplen,network))
#
#
# def eth_covert(e_addr):
#     ret_addr = "%02x:%02x:%02x:%02x:%02x:%02x" % ((e_addr[0]), (e_addr[1]), (e_addr[2]), (e_addr[3]), (e_addr[4]), (e_addr[5]))
#     return ret_addr
#
#
# def ethernet_header(file_f):
#     dest_mac_add = eth_covert(unpack('BBBBBB', file_f[:6]))
#     source_mac_add = eth_covert(unpack('BBBBBB', file_f[6:12]))
#
#     # etype: ipv4/6(0x0800) -> (0xBB) but omitted 0x here#
#     a = unpack('BB', file_f[12:14])
#     etype = "%02x%02x" % (a[0], a[1])
#     print(dest_mac_add,source_mac_add)
