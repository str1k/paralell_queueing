#include "mpi.h"
#include <stdio.h>
#include <string.h>
#include <stdlib.h>
#include <time.h>





// TODO: In the “Project Properties” under “Configuration Properties”,
// select the “Debugging” node and switch the “Debugger to launch:”
// combobox value to “MPI Cluster Debugger”.
int main(int argc, char* argv[])
{
	MPI_Init(&argc, &argv);
	int rank,size;
	MPI_Comm_rank (MPI_COMM_WORLD, &rank);	/* get current process id */
	MPI_Comm_size (MPI_COMM_WORLD, &size);	/* get number of processes */
	int row,column,rowA,columnA,rowB,columnB,i,j,k;
	double ** heat;
	double ** heatP;
	double ** tempA;
	MPI_Status status;

	double ** matrixC;
	int temp,a;
	int startIndex = 0;
	int maxIndex = 0;
	int time,timestep;
	int workR,workC,checkR,checkC;
	int workdis,frac,disC;
	int * workrank;
	double * ezsendarray;
	double startTime,endTime;

	time=1;
	timestep =10000;



	printf("Size of Processes : %d\n",size);
	printf("I'm Process number : %d\n",rank);
	if(rank == 0)
		{
		FILE * pFile;
		pFile = fopen ("heat10000.txt","r");
		if (pFile==NULL)
			{
			printf("Kabooommmmmmmmmmm!!!!!!!!!!!!!!\n\n\n");
			getchar();
			}
		else
			{
			fscanf (pFile, "%d %d", &rowA, &columnA);
			printf("rowA:%d columnA:%d\n",rowA,columnA);
			/*calloc part*/
			heat = (double **)calloc(rowA,sizeof(double *));
			for(i = 0; i<rowA;i++)
				{
				heat[i] = (double *)calloc(columnA,sizeof(double));
				}

			/*Matrix A to arrays*/
			for(i = 0; i < rowA; i++)
				{
				for(j=0; j<columnA; j++)
					{
					fscanf(pFile,"%lf",&heat[i][j]);
					}
				}
			}
		fclose(pFile);
		}
		if(size>1)
			{
			MPI_Barrier(MPI_COMM_WORLD);
			MPI_Bcast(&rowA,1, MPI_INT, 0,MPI_COMM_WORLD);
			MPI_Bcast(&columnA,1, MPI_INT, 0,MPI_COMM_WORLD);
			}
		workR = rowA/2;
		workC = columnA/2;
		checkR=0;
		checkC=0;
		if(rowA%2 != 0)
			{
			checkR=1;
			workR++;
			}
		if(columnA%2 != 0)
			{
			checkC=1;
			workC++;
			printf("hello\n");
			}
		if(size>1)
				{
				disC = workC-1; //we don't take first column to the calculation
				if(checkC == 1) disC--;
				workrank = (int *)calloc(size,sizeof(int));
				workdis = disC/size; //integer
				frac = disC%size; //leftover
				printf("workR:%d workC:%d disC:%d workdis:%d frac:%d\n",workR,workC,disC,workdis,frac);
				for(i=0;i<size;i++)
					{
					workrank[i] = workdis;
					if(frac > 0)
						{
						workrank[i]++;
						frac--;
						}
					if(checkC == 1 && i == size-1)
						workrank[i]++;
					printf("workrank[%d]:%d \n",i,workrank[i]);
					}
				}

		startTime = MPI_Wtime();

		/* hell of paralelism start here, let's the hunger games begin
		 *
		 * if anything bug it fracking here
		 */
		if(size>1)
			{
			//allocate thier own main 2d array to work
			//exept mr.0 since he already have one

			heatP = (double **)calloc(workR,sizeof(double *));
			for(i = 0; i<workR;i++)
				{
				heatP[i] = (double *)calloc(workC,sizeof(double));
				}

			tempA = (double **)calloc(workR,sizeof(double *));
			for(i = 0; i<workR;i++)
				{
				tempA[i] = (double *)calloc(workC,sizeof(double));
				}


			//now the index cutter is here.. hehehue uheuhe
			if(rank == 0)
				{
				startIndex = 1;
				maxIndex = workrank[rank]+startIndex;
				}
			else
				{
				startIndex = 1;
				for(i=1;i<=rank;i++)
					{
					startIndex = startIndex + workrank[i-1]; //start = previous max
					maxIndex = startIndex + workrank[i];//actually it is the next process startindex
					}
				}
			printf("watashi no StartoIndexu is %d MaxuIndex is %d\n",startIndex,maxIndex);
			//index cutter end here


			for(i=0;i<workR;i++)
				{
				for(j=0;j<workC;j++)
					{
					//initailizing array value in slave process
					if(rank != 0)
						heatP[i][j] = 0;
					else
						{
						heatP[i][j] = heat[i][j];
						}
					}
				}

			double * ezsendarray;
			ezsendarray = (double *)calloc(workC*workR,sizeof(double));


			if(rank == 0)
					{
					for(i=0;i<workC;i++)
						{
						ezsendarray[i] = heatP[0][i];
						}
					for(i=1;i<size;i++)
						{
						MPI_Send(ezsendarray, workC, MPI_DOUBLE, i, 123, MPI_COMM_WORLD);
						}
					}

				if(rank != 0)
					{
					MPI_Recv(ezsendarray, workC, MPI_DOUBLE, 0, 123, MPI_COMM_WORLD, &status);
					for(i=0;i<workC;i++)
						{
						tempA[0][i] = ezsendarray[i];
						heatP[0][i] = ezsendarray[i];
						}

					}
			while(time <= timestep)
				{
				MPI_Barrier(MPI_COMM_WORLD);
				//calculate temperature in each timestep individually
				//so first other than 0 need to get thier information



				//get left row
				for(i = 0; i < workR;i++)
					{
					ezsendarray[i] = heatP[i][maxIndex-1];
					}
				if(rank != size-1)
					MPI_Send(ezsendarray, workR, MPI_DOUBLE, rank+1, 123, MPI_COMM_WORLD);
				if(rank != 0)
					MPI_Recv(ezsendarray, workR, MPI_DOUBLE, rank-1, 123, MPI_COMM_WORLD, &status);

				//unpack left array into 2-d array exept process 0
				if(rank != 0)
					{
					for(i = 0;i < workR;i++)
						{
						heatP[i][startIndex-1] = ezsendarray[i];
						}
					}


				//get right row
				for(i = 0; i < workR;i++)
					{
					ezsendarray[i] = heatP[i][startIndex];
					}
				if(rank != 0)
					MPI_Send(ezsendarray, workR, MPI_DOUBLE, rank-1, 3, MPI_COMM_WORLD);
				if(rank != size-1)
					MPI_Recv(ezsendarray, workR, MPI_DOUBLE, rank+1, 3, MPI_COMM_WORLD, &status);

				//unpack right array into 2-d array exept process 0
				if(rank != size-1)
					{
					for(i = 0;i < workR;i++)
						{
						heatP[i][maxIndex] = ezsendarray[i];
						}
					}
				//everybody gonna keep the temp for this timestep calculation
				for(i = 0; i < workR; i++)
					{
					//keep only their calculaton zone to reduce wasted time
					if(rank != size-1)
						{
						for(j = startIndex-1; j < maxIndex+1; j++)
							{
							tempA[i][j] = heatP[i][j];
							}
						}
					else
						{
						for(j = startIndex-1; j < maxIndex; j++)
							{
							tempA[i][j] = heatP[i][j];
							}
						}
					}
				//now we ready for calculation

				//case 1 rows % 2 && colum % 2 = 0 , 0
				if(checkR == 0 && checkC == 0)
					{
					for(i=1;i<workR;i++)
						{
						for(j=startIndex; j<maxIndex;j++)
							{

							if(rank != size-1)
								{

								if(i == workR-1)
									heatP[i][j] = (tempA[i-1][j]+tempA[i][j]+tempA[i][j-1]+tempA[i][j+1])/4;
								else
									heatP[i][j] = (tempA[i-1][j]+tempA[i+1][j]+tempA[i][j-1]+tempA[i][j+1])/4;
								}
							else
								{
								if(i == workR-1 && j == maxIndex-1)
									heatP[i][j] = (tempA[i-1][j]+tempA[i][j-1]+tempA[i][j]+tempA[i][j])/4;
								else if( i == workR-1)
									heatP[i][j] = (tempA[i-1][j]+tempA[i][j]+tempA[i][j-1]+tempA[i][j+1])/4;
								else if(j == maxIndex-1)
									heatP[i][j] = (tempA[i-1][j]+tempA[i+1][j]+tempA[i][j-1]+tempA[i][j])/4;
								else
									heatP[i][j] = (tempA[i-1][j]+tempA[i+1][j]+tempA[i][j-1]+tempA[i][j+1])/4;
								}
							}
						}
					}
				else if(checkR == 0 && checkC == 1)
					{
					//getchar();
					for(i=1;i<workR;i++)
						{
						if(rank != size-1)
							{
							for(j=startIndex; j<maxIndex;j++)
								{
								if(i == workR-1)
									heatP[i][j] = (tempA[i-1][j]+tempA[i][j]+tempA[i][j-1]+tempA[i][j+1])/4;
								else
									heatP[i][j] = (tempA[i-1][j]+tempA[i+1][j]+tempA[i][j-1]+tempA[i][j+1])/4;
								}
							}
						else if(rank == size-1)
							{
							for(j=startIndex; j<maxIndex-1;j++)
								{
								if(i == workR-1 && j != maxIndex-2)
									heatP[i][j] = (tempA[i-1][j]+tempA[i][j]+tempA[i][j-1]+tempA[i][j+1])/4;
								else if(i == workR-1 && j == maxIndex-2)
									heatP[i][j] = (tempA[i-1][j]+tempA[i][j]+tempA[i][j-1]+tempA[i][j+1])/4;
								else
									heatP[i][j] = (tempA[i-1][j]+tempA[i+1][j]+tempA[i][j-1]+tempA[i][j+1])/4;
								}
							if(i == workR-1)
								heatP[i][maxIndex-1] =  (tempA[i-1][maxIndex-1]+tempA[i][maxIndex-1]+tempA[i][maxIndex-1-1]+tempA[i][maxIndex-1-1])/4;
							else
								heatP[i][maxIndex-1] =  (tempA[i-1][maxIndex-1]+tempA[i+1][maxIndex-1]+tempA[i][maxIndex-1-1]+tempA[i][maxIndex-1-1])/4;
							}
						}
					}
				else if(checkR == 1 && checkC == 0)
					{
					for(i=1;i<workR-1;i++)
						{
						for(j=startIndex; j<maxIndex;j++)
							{

							if(rank != size-1)
								{
								heatP[i][j] = (tempA[i-1][j]+tempA[i+1][j]+tempA[i][j-1]+tempA[i][j+1])/4;
								if(i == workR-1)
									heatP[i][maxIndex-1] =  (tempA[i-1][maxIndex-1]+tempA[i][maxIndex-1]+tempA[i][maxIndex-1-1]+tempA[i][maxIndex-1-1])/4;
								else
									heatP[i][maxIndex-1] =  (tempA[i-1][maxIndex-1]+tempA[i+1][maxIndex-1]+tempA[i][maxIndex-1-1]+tempA[i][maxIndex-1-1])/4;
								}
							else
								{
								if(i != workR-2 && j == maxIndex-1)
									heatP[i][j] = (tempA[i-1][j]+tempA[i+1][j]+tempA[i][j-1]+tempA[i][j])/4;
								else if(i == workR-2 && j == maxIndex-1)
									heatP[i][j] = (tempA[i-1][j]+tempA[i+1][j]+tempA[i][j-1]+tempA[i][j])/4;
								else
									heatP[i][j] = (tempA[i-1][j]+tempA[i+1][j]+tempA[i][j-1]+tempA[i][j+1])/4;
								}
							}
						}

					for(i=startIndex;i<maxIndex;i++)
						{
						if(rank == size-1)
							{
							if(i == maxIndex-1)
								{
								heatP[workR-1][i] = (tempA[workR-2][i]+tempA[workR-1][i]+tempA[workR-1][i-1]+tempA[workR-1][i])/4;
								}
							else
								{
								heatP[workR-1][i] = (tempA[workR-2][i]+tempA[workR-1][i]+tempA[workR-1][i-1]+tempA[workR-1][i+1])/4;
								}
							}
						else
							{
							heatP[workR-1][i] = (tempA[workR-2][i]+tempA[workR-1][i]+tempA[workR-1][i-1]+tempA[workR-1][i+1])/4;
							}
						}
					}
				else //1,1
					{
					for(i=1;i<workR-1;i++)
						{
						if(rank == size-1)
							{
							for(j=startIndex; j<maxIndex-1;j++)
								{
								heatP[i][j] = (tempA[i-1][j]+tempA[i+1][j]+tempA[i][j-1]+tempA[i][j+1])/4;
								}
							}
						else
							{
							for(j=startIndex; j<maxIndex;j++)
								{
								heatP[i][j] = (tempA[i-1][j]+tempA[i+1][j]+tempA[i][j-1]+tempA[i][j+1])/4;
								}
							}
						if(i != workR-1)
							if(rank == size-1)
								heatP[i][maxIndex-1] =  (tempA[i-1][maxIndex-1]+tempA[i+1][maxIndex-1]+tempA[i][maxIndex-1-1]+tempA[i][maxIndex-1-1])/4;
						}
					for(i=startIndex;i<maxIndex;i++)
						{
						if(rank == size-1 && i == maxIndex-1)
							heatP[workR-1][i] = (tempA[workR-2][i]+tempA[workR-2][i]+tempA[workR-1][i-1]+tempA[workR-1][i-1])/4;
						else
							heatP[workR-1][i] = (tempA[workR-2][i]+tempA[workR-2][i]+tempA[workR-1][i-1]+tempA[workR-1][i+1])/4;
						}
					}


				time++;
				}

			if(rank != 0)
				{
				k=0;
				for(i = 0; i < workR;i++)
					{
					for(j=startIndex; j < maxIndex;j++)
						{
						ezsendarray[k] = heatP[i][j];
						k++;
						}
					}
				MPI_Recv(&a, 1, MPI_INT, 0, 2, MPI_COMM_WORLD, &status);
				MPI_Send(&startIndex, 1, MPI_INT, 0, 2, MPI_COMM_WORLD);
				MPI_Send(&maxIndex, 1, MPI_INT, 0, 2, MPI_COMM_WORLD);
				MPI_Send(ezsendarray, workR*workrank[rank], MPI_DOUBLE, 0, 2, MPI_COMM_WORLD);
				}
			else
				{
				for(temp=1;temp<size;temp++)
					{
					MPI_Send(&a, 1, MPI_INT, temp, 2, MPI_COMM_WORLD);
					MPI_Recv(&startIndex, 1, MPI_INT, temp, 2, MPI_COMM_WORLD, &status);
					MPI_Recv(&maxIndex, 1, MPI_INT, temp, 2, MPI_COMM_WORLD, &status);
					MPI_Recv(ezsendarray, workR*workrank[temp], MPI_DOUBLE, temp, 2, MPI_COMM_WORLD, &status);
					k = 0;
					for(i = 0; i < workR;i++)
						{
						for(j=startIndex; j < maxIndex;j++)
							{
							heatP[i][j] = ezsendarray[k];
							k++;
							}
						}
					}
				}
			}

		/* End of paralization,  hope it's a happy ending here
		 *
		 */




		/*sequencial code is completed for one process, DONT TOUCH THESE
		#
		#
		#
		*/
		else if(size == 1)
		{
		printf("rowA:%d columnA:%d workR:%d workC:%d\n",rowA,columnA,workR,workC);
		tempA = (double **)calloc(workR,sizeof(double *));
			for(i = 0; i<workR;i++)
				{
				tempA[i] = (double *)calloc(workC,sizeof(double));
				}

		for(i = 0; i < workR; i++)
			{
			for(j = 0; j<workC; j++)
				{
				tempA[i][j] = heat[i][j];
				}
			}

		while(time <= timestep)
			{
			//calculate for one time step

			if(checkR == 0 && checkC == 0)
			{
			for(i=1;i<workR;i++)
				{
				for(j=1; j<workC;j++)
					{
					if(j == workC-1 && i != workR-1)
						{
						heat[i][j] = (tempA[i-1][j]+tempA[i+1][j]+tempA[i][j-1]+tempA[i][j])/4;
						}
					else if(i == workR-1 && j != workC-1)
						{
						heat[i][j] = (tempA[i-1][j]+tempA[i][j]+tempA[i][j-1]+tempA[i][j+1])/4;
						}
					else if(i == workR-1 && j == workC-1)
						{
						heat[i][j] = (tempA[i-1][j]+tempA[i][j-1]+tempA[i][j]+tempA[i][j])/4;
						}
					else
						{
						heat[i][j] = (tempA[i-1][j]+tempA[i+1][j]+tempA[i][j-1]+tempA[i][j+1])/4;
						}
					}
				}
			}


			else if(checkR == 0 && checkC == 1)
			{
			for(i=1;i<workR;i++)
				{
				for(j=1; j<workC-1;j++)
					{
					if(i == workR-1 && j != workC-2)
						{
						heat[i][j] = (tempA[i-1][j]+tempA[i][j]+tempA[i][j-1]+tempA[i][j+1])/4;
						}
					else if(i == workR-1 && j == workC-2)
						{
						heat[i][j] = (tempA[i-1][j]+tempA[i][j]+tempA[i][j-1]+tempA[i][j+1])/4;
						}
					else
						{
						heat[i][j] = (tempA[i-1][j]+tempA[i+1][j]+tempA[i][j-1]+tempA[i][j+1])/4;
						}
					}
				if(i == workR-1)
					heat[i][workC-1] =  (tempA[i-1][workC-1]+tempA[i][workC-1]+tempA[i][workC-1-1]+tempA[i][workC-1-1])/4;
				else
					heat[i][workC-1] =  (tempA[i-1][workC-1]+tempA[i+1][workC-1]+tempA[i][workC-1-1]+tempA[i][workC-1-1])/4;
				}
			}



			else if(checkR == 1 && checkC == 0)
			{
			for(i=1;i<workR-1;i++)
				{
				for(j=1; j<workC;j++)
					{
					if(i != workR-2 && j == workC-1)
						{
						heat[i][j] = (tempA[i-1][j]+tempA[i+1][j]+tempA[i][j-1]+tempA[i][j])/4;
						}
					else if(i == workR-2 && j == workC-1)
						{
						heat[i][j] = (tempA[i-1][j]+tempA[i+1][j]+tempA[i][j-1]+tempA[i][j])/4;
						}
					else
						{
						heat[i][j] = (tempA[i-1][j]+tempA[i+1][j]+tempA[i][j-1]+tempA[i][j+1])/4;
						}
					}
				}
			for(i=1;i<workC;i++)
				{
				if(i == workC-1)
					heat[workR-1][i] = (tempA[workR-2][i]+tempA[workR-1][i]+tempA[workR-1][i-1]+tempA[workR-1][i])/4;
				else
					heat[workR-1][i] = (tempA[workR-2][i]+tempA[workR-1][i]+tempA[workR-1][i-1]+tempA[workR-1][i+1])/4;
				}
			}

			else //1,1
			{
			for(i=1;i<workR-1;i++)
				{
				for(j=1; j<workC-1;j++)
					{
					heat[i][j] = (tempA[i-1][j]+tempA[i+1][j]+tempA[i][j-1]+tempA[i][j+1])/4;
					}
				if(i != workR-1)
					heat[i][workC-1] =  (tempA[i-1][workC-1]+tempA[i+1][workC-1]+tempA[i][workC-1-1]+tempA[i][workC-1-1])/4;
				}
			for(i=1;i<workC;i++)
					{
					if(i == workC-1)
						heat[workR-1][i] = (tempA[workR-2][i]+tempA[workR-2][i]+tempA[workR-1][i-1]+tempA[workR-1][i-1])/4;
					else
						heat[workR-1][i] = (tempA[workR-2][i]+tempA[workR-2][i]+tempA[workR-1][i-1]+tempA[workR-1][i+1])/4;
					}
			}
			//update temp
			for(i = 1; i < workR; i++)
				{
				for(j = 1; j<workC; j++)
					{
					tempA[i][j] = heat[i][j];
					}
				}
			time++;
			}
			}
			/*end of sequencial after these are real hell
			#
			#
			*/
		endTime = MPI_Wtime();
		printf("Start time : %.2lf End time : %.2lf\n",startTime,endTime);
		printf("Time used : %.2lf\n",endTime-startTime);

		if(size > 1 && rank == 0)
		{
		for(i=1;i<workR;i++)
			{
			for(j=1;j<workC;j++)
				{
				heat[i][j] = heatP[i][j];
				}
			}
		}
		if(rank == 0)
		{
		//flip the result

		if(checkR == 1 && checkC ==1)
		{
		for(i = 1; i<workR-1;i++)
			{
			for(j = 1; j < workC-1; j++)
				{
				heat[i][columnA-j-1] = heat[i][j];
				heat[rowA-i-1][j] = heat[i][j];
				heat[rowA-i-1][columnA-j-1] = heat[i][j];
				}
			}
		for(i = 1;i < workC-1;i++)
			{
			heat[workR-1][columnA-1-i] = heat[workR-1][i];
			}
		for(i = 1;i < workR-1;i++)
			{
			heat[rowA-1-i][workC-1] = heat[i][workC-1];
			}
		}
		else
		{
		for(i = 1; i<workR;i++)
			{
			for(j = 1; j < workC; j++)
				{
				heat[i][columnA-j-1] = heat[i][j];
				heat[rowA-i-1][j] = heat[i][j];
				heat[rowA-i-1][columnA-j-1] = heat[i][j];
				}
			}
		}




		FILE * pFile3;

		pFile3 = fopen("Result.txt","w");
		fprintf(pFile3, "%d %d\n",rowA,columnA);
		for(i = 0; i < rowA; i++)
			{
			for(j=0; j<columnA; j++)
				{
				if(j == columnA-1)
					{
					fprintf(pFile3, "%.2lf\n",heat[i][j]);
					}
				else
					{
					fprintf(pFile3, "%.2lf ",heat[i][j]);
					}
				}
		}
		fclose(pFile3);
		printf("Write FILE DONE!!!\n");
		}

	printf("DONE!!!\n");
	MPI_Finalize();
	return 0;
}
