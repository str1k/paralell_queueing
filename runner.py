import MySQLdb
import subprocess
import datetime as dt
import time
import filecmp
import os.path
import time
import traceback
fileA = "matrix1.txt"
fileB = "matrix2.txt"
while(True):
	conn = MySQLdb.connect(host= "localhost",
                  user="root",
                  passwd="P@ssw0rd?",
                  db="parallel")
	x = conn.cursor()
	x.execute("SELECT * FROM record_tbls where status = 'N'")
	queryRet = x.fetchall()
	for row in queryRet:
		#UPDATE record_tbls
		print("Starting ID:"+str(row[1]))
		print("DB ID:"+str(row[0]))
		x.execute ("""UPDATE record_tbls SET status='P' WHERE id=%s""",( [row[0]]))
		conn.commit()
		time.sleep(0.1)
		#print row[1] ID
		compilecmd = "mpicc -o "+ row[1] + " "+ row[1] + ".*"
		deletecmd = "rm " + row[1] + "_out"
		try:
			compileLog = subprocess.check_output(compilecmd, shell=True)
			deleteLog = subprocess.check_output(deletecmd, shell=True)
		except Exception as e:
			print(e.message)
			compileLog = str(e.message)
		print("Code Compiled")
		if not compileLog:
			print("Compilation Successful")
			#UPDATE record_tbls
			st=dt.datetime.now()
			x.execute ("UPDATE record_tbls SET compile_status=1,updated_at=%s  WHERE id=%s",\
			( st, [row[0]]))
			conn.commit()
			time.sleep(0.1)
			print("Starting to execute MPI command")
			runcmd="timeout 1200 mpirun -f hosts -n 19 ./" + row[1] + " " + fileA + " " + fileB + " "+ row[1] + "_out"
			n1=dt.datetime.now()
			start = time.time()
			logName = row[1]+ "_"+ str(row[0]) +"_log"
			logPath = "/var/www/parallel/public/" + logName
			try:
				print subprocess.check_output(runcmd, shell=True)
			except subprocess.CalledProcessError, e: 
				text_file = open( logPath, "w")
				text_file.write(str(e.output) + "\n"+str(e.message))
				text_file.close()
				x.execute ("UPDATE record_tbls SET status='S', compile_status=1, process_log_path=%s  WHERE id=%s",\
			 	(logName, [row[0]]))
				conn.commit()
				time.sleep(3)
				print("Error")
				break
			end = time.time()
			n2=dt.datetime.now()
			print("MPI program ran")
			timer = end - start
			
			
			if(timer > 1199):
				#UPDATE record_tbls
				text_file = open( logPath, "w")
				text_file.write("Process killed Run too long")
				text_file.close()
				x.execute ("UPDATE record_tbls SET status='S', compile_status=1, timer=%s, process_log_path=%s  WHERE id=%s",\
			 	(str(timer), logName, [row[0]]))
			 	conn.commit()
				time.sleep(0.1)
				print("Run too long table updated")
			else:
				print("Run in time:"+ str(timer))
				if os.path.isfile(row[1]+'_out'):
					if( filecmp.cmp(row[1]+'_out', 'correctLG') or filecmp.cmp(row[1]+'_out', 'ResultAc2') ):
						#correct
						print("Output is correct")
						#UPDATE record_tbls
						x.execute("UPDATE record_tbls SET status='S', correctness=1, compile_status=1, timer=%s, process_log_path=%s  WHERE id=%s",\
			 				(str(timer), logName, [row[0]]))
			 			conn.commit()
						time.sleep(0.1)
						#Check Ranking Table
						x.execute("SELECT * FROM ranking_tbls")
						ranking = x.fetchall()
						existed = 0
						rank_id = "0"
						for rank in ranking:
							if int(row[1]) == int(rank[1]):
								existed = 1
								rank_id = [rank[0]]
						if existed == 1:
							#Update existing record in ranking_tbls
							x.execute("UPDATE ranking_tbls SET status='S', correctness=1, compile_status=1, timer=%s, process_log_path=%s,updated_at=%s  WHERE id=%s",\
			 					(str(timer), logName, rank_id,n2))
			 				conn.commit()
							time.sleep(0.1)
						else:
							#Insert new record in ranking_tbls
							x.execute("SELECT COUNT(*) FROM ranking_tbls")
							count = x.fetchall()
							x.execute("""INSERT INTO ranking_tbls VALUES (%s,%s,%s,%s,%s,%s,%s,%s,%s,%s,%s)""",\
							(str(count[0][0]),row[1],row[2],row[3], 0, logName, 1, str(timer),'S',n2,n2))
							conn.commit()
							time.sleep(0.1)
					else:
						print("Output is wrong")
						#UPDATE record_tbls
						text_file = open( logPath, "w")
						text_file.write("Result is generated but it is wrong")
						text_file.close()
						x.execute ("UPDATE record_tbls SET status='S', correctness=0, compile_status=1, timer=%s, process_log_path=%s  WHERE id=%s",\
			 				(str(timer), logName, [row[0]]))
			 			conn.commit()
						time.sleep(0.1)
				else:
					#UPDATE record_tbls
						print("No output code error")
						x.execute ("UPDATE record_tbls SET status='S', correctness=0, compile_status=1, timer=%s, process_log_path=%s  WHERE id=%s",\
			 				(str(timer), logName, [row[0]]))
			 			conn.commit()
						time.sleep(0.1)



		else:
			#write log
			print("Compilation error")
			logName = row[1]+ "_"+ str(row[0]) +"_log"
			logPath = "/var/www/parallel/public/" + logName
			text_file = open( logPath, "w")
			text_file.write(compileLog)
			text_file.close()
			#UPDATE record_tbls
			x.execute ("UPDATE record_tbls SET status='S', compile_status=0, process_log_path=%s  WHERE id=%s",\
			 	(logName, str(row[0])))
			conn.commit()
			time.sleep(0.1)
			print("Error")

	
	for i in range(1, 15):
		print("Waiting for next update in " + str(15-i) + " sec")
		time.sleep(1)	