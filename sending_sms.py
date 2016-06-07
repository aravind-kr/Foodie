'''
The following source code connects with Mysql database and Twilio to send sms to numbers stored in database. The message is declared implicitly. We can make modification to db to make a dynamic message.
'''
from __future__ import unicode_literals
import tamil
import MySQLdb as sql #mysql connector
from twilio.rest import TwilioRestClient #importing tiwilio rest api.
#connecting to mysql
db = sql.connect(host='localhost',
		 user='root',
		 passwd='Yoga_30696',
		 db='partha');
cur = db.cursor()

#defining the account credentials for twilio - katta account
account_sid = "ACc162d0655071962acf18a895f9686f34"
auth_token = "74520e39b4ece043bce83e0d7020aa60"

def send_sms(number):
	client = TwilioRestClient(account_sid, auth_token)
	message = client.messages.create(to=number, from_="+13852158281",
                                     body="RSNS: Testing!! Test is ok!")
	print "Message sent successfully"



def db_details():
	#selecting the numbers from the table
	cur.execute('select * from details');
	length = len(cur.fetchall())
	#looks for numbers length in db and passes the number to send_sms() function.
	for i in range(length):
		cur.execute('select * from details');
		number = cur.fetchall()[i][1]
		send_sms(number)
	cur.close()
db_details()
