import MySQLdb
import subprocess
import datetime as dt
import filecmp
import os.path
import time
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
		print("Starting ID:"+row[1])
		x.execute ("UPDATE record_tbls SET status='P' WHERE id=%s",( str(row[0])))
		conn.commit()
		time.sleep(0.1)
		#print row[1] ID
		compilecmd = "mpicc -o "+ row[1] + " "+ row[1] + ".*"
		try:
			compileLog = subprocess.check_output(compilecmd, shell=True)
		except Exception as e:
			print(e)
			compileLog = e
		print("Code Compiled")
		if not compileLog:
			print("Compilation Successful")
			#UPDATE record_tbls
			x.execute ("UPDATE record_tbls SET compile_status=1  WHERE id=%s",\
			( str(row[0])))
			conn.commit()
			time.sleep(0.1)
			print("Starting to execute MPI command")
			runcmd="timeout 1200 mpirun -f hosts -n 19 ./" + row[1] + " " + fileA + " " + fileB + " "+ row[1] + "_out"
			n1=dt.datetime.now()
			logName = row[1]+ "_"+ str(row[0]) +"_log"
			logPath = "/nfs/code/recent/" + logName
			try:
				runLog = subprocess.check_output(runcmd, shell=True)
				text_file = open( logName, "w")
				text_file.write(runLog)
				text_file.close(logName)
			except Exception as e: 
				text_file = open( logName, "w")
				text_file.write(e)
				text_file.close(logName)

			n2=dt.datetime.now()
			print("MPI program ran")
			timer = (n2-n1).microseconds / 1e6
			
			
			if(timer > 1199):
				#UPDATE record_tbls
				x.execute ("UPDATE record_tbls SET status='S', compile_status=1, timer=%s, process_log_path=%s  WHERE id=%s",\
			 	(str(timer), logPath, str(row[0])))
			 	conn.commit()
				time.sleep(0.1)
				print("Run too long table updated")
			else:
				print("Run in time:"+ str(timer))
				if os.path.isfile(row[1]+'_out'):
					if(filecmp.cmp(row[1]+'_out', 'testingresult')):
						#correct
						print("Output is correct")
						#UPDATE record_tbls
						x.execute("UPDATE record_tbls SET status='S', correctness=1, compile_status=1, timer=%s, process_log_path=%s  WHERE id=%s",\
			 				(str(timer), logPath, str(row[0])))
			 			conn.commit()
						time.sleep(0.1)
						#Check Ranking Table
						x.execute("SELECT * FROM ranking_tbls")
						ranking = x.fetchall()
						existed = 0
						rank_id = 0
						for rank in ranking:
							if row[1] == rank[1]:
								existed = 1
								rank_id = rank[0]
								break
						if existed == 1:
							#Update existing record in ranking_tbls
							x.execute("UPDATE ranking_tbls SET status='S', correctness=1, compile_status=1, timer=%s, process_log_path=%s  WHERE id=%s",\
			 					(str(timer), logPath, rank_id))
			 				conn.commit()
							time.sleep(0.1)
						else:
							#Insert new record in ranking_tbls
							x.execute("SELECT COUNT(*) FROM ranking_tbls")
							count = x.fetchall()
							x.execute("""INSERT INTO ranking_tbls VALUES (%s,%s,%s,%s,%s,%s,%s,%s,%s,%s,%s)""",\
							(str(count[0][0]+1),row[1],row[2],row[3], 0, logPath, 1, str(timer),'S',time.strftime('%Y-%m-%d %H:%M:%S', n2),time.strftime('%Y-%m-%d %H:%M:%S', n2)))
							conn.commit()
							time.sleep(0.1)
					else:
						print("Output is wrong")
						#UPDATE record_tbls
						x.execute ("UPDATE record_tbls SET status='S', correctness=0, compile_status=1, timer=%s, process_log_path=%s  WHERE id=%s",\
			 				(str(timer), logPath, str(row[0])))
			 			conn.commit()
						time.sleep(0.1)
				else:
					#UPDATE record_tbls
						print("No output code error")
						x.execute ("UPDATE record_tbls SET status='S', correctness=0, compile_status=1, timer=%s, process_log_path=%s  WHERE id=%s",\
			 				(str(timer), logPath, str(row[0])))
			 			conn.commit()
						time.sleep(0.1)



		else:
			#write log
			print("Compilation error")
			logName = row[1]+ "_"+ str(row[0]) +"_log"
			logPath = "/nfs/code/recent/" + logName
			text_file = open( logName, "w")
			text_file.write("")
			text_file.close(compileLog)
			#UPDATE record_tbls
			x.execute ("UPDATE record_tbls SET status='S', compile_status=0, process_log_path=%s  WHERE id=%s",\
			 	(logPath, str(row[0])))
			conn.commit()
			time.sleep(0.1)
			print("Error")

	
	for i in range(1, 15):
		print("Waiting for next update in " + str(15-i) + " sec")
		time.sleep(1)	