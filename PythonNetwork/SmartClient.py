# By Aaron Mok V00924998
# Assignment 1
# !/bin/env python
import socket
import ssl
import re
import sys

'''
Reads input from stdin, regardless if the format is correct or not, only accepts a single argument
Said input is then sent to request() to test for correctness. Return error if invalid domain name.
'''
def main():
    print('Enter domain name or ctrl+c to stop:')
    for line in sys.stdin:
        if len(line.split()) == 1:
            request(line)
        print('\nPlease input a site as followed: www.(host_name).(dns). eg: "www.google.com"\n')
        continue


'''
Main http request. First try 1.1 through port 80. If this fails, go to hstest to test for https on 1.0.
If 1.1 connects, try again with ssl. If true once again, https is supported, and send to h2test and test for h2 support.
Quick notes: rstrip() is cause the string passed contains newline. Removing the \r will prevent errors.
Once everything is tested, select a valid GET request (prioritize https) and send it to the website.
After, collect remaining information and send to cookie_farm/output to print out.
'''
def request(line):
    if "/" in line:
        host_name, loc = line.split("/", 1)
        host_name.rstrip()
        loc.rstrip()

    else:
        host_name = line.rstrip()
        loc = ''

    r = "GET /{}HTTP/1.1\r\nHost: {}\r\nConnection: Upgrade, HTTP2-Settings\r\nUpgrade: h2c\r\nHTTP2-Settings: <base64url encoding of HTTP/2 SETTINGS payload>\r\n\r\n".format(loc, host_name)
    hsval = False
    h2val = False
    h11val = False
    s = socket.socket(socket.AF_INET, socket.SOCK_STREAM)

    try:
        host = socket.gethostbyname(host_name)
    except socket.gaierror:
        print('Failed to connect to "{}". Please try again'.format(host_name))
        return

    try:
        print('---Attempting to connect to {} via http/1.1'.format(host_name))
        s.connect((host_name, 80))
        s.send(r.encode())
        feedback = s.recv(4096).decode('utf-8', 'ignore')
        if feedback:
            print('---Connection established. Testing https now---')
            h11val = True
            s.close()
            s = socket.socket(socket.AF_INET, socket.SOCK_STREAM)
            if hstest(host_name, s, 0):
                print('---Https supported. Testing for http/2---')
                hsval = True
                if h2test(host_name):
                    print('---Http2 supported. Moving on...---')
                    h2val = True

        s.close()
    except socket.error:
        print('---Problem when connecting with http/1.1. Testing for https now---')
        if hstest(host_name, s, 1):
            print('---Https supported. Moving on---')
            hsval = True
        else:
            print('Problem with request, maybe try a different website.')
            return

    s = socket.socket(socket.AF_INET, socket.SOCK_STREAM)
    if hsval:
        s = ssl.wrap_socket(s, keyfile=None, certfile=None, server_side=False, cert_reqs=ssl.CERT_NONE, ssl_version=ssl.PROTOCOL_SSLv23)
        s.connect((host_name, 443))
    else:
        s.connect((host_name, 80))
    s.sendall(r.encode())

    while True:
        msg = s.recv(4096).decode('utf-8', 'ignore')
        if not msg:
            s.close()
            print('Something went wrong with decoding... Going to print. Maybe try another website?')
            break
        print('\n>>>Finalizing result with cookies<<<\n\nCurrent Request Message:\n{}\n'.format(r.rstrip()))
        output(host_name, h2val, h11val, hsval)
        cookie_farm(msg)
        s.close()
        break


'''
Tests for https for 1.0. Uses ssl(https) and return true if https is supported.
'''
def hstest(host_name, s, val):
    if val == 1:
        r = "GET / HTTP/1.0\r\nHost: {}\r\n\r\n".format(host_name)
    else:
        r = "GET / HTTP/1.1\r\nHost: {}\r\n\r\n".format(host_name)

    try:
        s = ssl.wrap_socket(s, keyfile=None, certfile=None, server_side=False, cert_reqs=ssl.CERT_NONE,
                            ssl_version=ssl.PROTOCOL_SSLv23)
        s.connect((host_name, 443))
        s.sendall(r.encode())
        msg = s.recv(4096).decode('utf-8', 'ignore')
        if msg:
            s.close()
            if val == 1:
                return msg
            return True
        else:
            s.close()
            return False
    except socket.error:
        print('Problem with decoding. Proceeding with print')
        s.close()
        return False


'''
Fuction used to test h2 only. By nature of set/select alpn, it will return none if no support for h2.
Returns true if h2 is supported.
'''
def h2test(host_name):
    test = ssl.create_default_context()
    test.set_alpn_protocols(['h2'])
    h2st = test.wrap_socket(socket.socket(socket.AF_INET, socket.SOCK_STREAM), server_hostname=host_name)
    h2st.connect((host_name.rstrip(), 443))
    h2result = h2st.selected_alpn_protocol()
    if h2result == "h2":
        h2st.close()
        return True
    else:
        print('---Http2 not supported---\n')
        h2st.close()
        return False


'''
This function formats the print string to display regarding cookies. 
Prints out cookies as it finds them
Also added the response message to print out (optional)
'''
def cookie_farm(msg):
    #mess2 = 'Set-Cookie: SESSID_UV_128004=VD3vOJhqL3YUbmaZSTJre1; path=/; expires=Today; Max-Age=0; domain=www.uvic.ca'
    '''This output is optional. Displays response header and body. Uncomment to view'''
    #print(msg)

    a = re.compile(r"Set-Cookie: (.*?)=", re.IGNORECASE)
    b = re.compile(r"expires=(.*?)(?:;|$)", re.IGNORECASE)
    c = re.compile(r"domain=(.*?)(?:;|$)", re.IGNORECASE)

    print('List of Cookies:')
    for lines in msg.splitlines():
        part_msg = ''
        x = re.search(a, lines)
        if x:
            part_msg = part_msg + 'cookie name: {}'.format(x.group(1))
        y = re.search(b, lines)
        if y:
            part_msg = part_msg + ', expires time: {}'.format(y.group(1))
        z = re.search(c, lines)
        if z:
            part_msg = part_msg + ', domain name:{}'.format(z.group(1))
        if part_msg:
            print(part_msg)

'''
Display supports for different protocols
'''
def output(host_name, h2, h1, hs):
    print('Result:\nwebsite: {}\nHTTPS support: {}\nHTTP/1.1 support: {}\nHTTP/2 support: {}'.format(host_name, hs, h1, h2))


if __name__ == '__main__':
    try:
        main()
    except KeyboardInterrupt:
        print('Exiting')
        exit(0)
