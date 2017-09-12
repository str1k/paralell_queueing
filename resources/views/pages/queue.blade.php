@extends('master')
@section('content')
<section id="flaging">
		<div class="container">
			<div class="row">
            	<div class="col-lg-12">
                	<h1 class="page-header">
                	</h1>
            	</div>
        	</div>
		</div>
</section>
<section id="flaging">
		<div class="container">
			<div class="row">
            	<div class="col-lg-12">
                	<h1 class="page-header">
                	QUEUEING
                	</h1>
            	</div>
        	</div>
        	<div class="table-responsive">
            <table class="table">
                <thead>
                    <tr>
                        <th>ID</th>
                        <th>Remark</th>
                        <th>Queue Left</th>
                        <th>Status</th>
                        <th>Time Submitted</th>
                        <th>Time Start</th>
                    </tr>
                </thead>
                <tbody id="countries-list" name="countries-list">
                    @if(!is_null($destroyer))
                    <tr bgcolor="#c4c0c0" id="$success{{$success->id}}">
                        <td>{{$$destroyer->stu_id}}</td>
                        <td>{{$destroyer->remark}}</td>
                        <td>-</td>
                        <td>Recent Cluster Destroyer</td>
                        <td>{{$destroyer->created_at}}</td>
                        <td>{{$destroyer->updated_at}}</td>
                    </tr>
                    @endif
                	@foreach ($running as $run)
                    
                    <tr bgcolor="#79e069" id="record{{$run->id}}">
                        <td>{{$run->stu_id}}</td>
                        <td>{{$run->remark}}</td>
                        <td>0</td>
                        <td>Running</td>
                        <td>{{$run->created_at}}</td>
                        <td>{{$run->updated_at}}</td>
                    </tr>
                    @endforeach
                    @foreach ($records as $record)
                    
                    <tr id="record{{$record->id}}">
                        <td>{{$record->stu_id}}</td>
                        <td>{{$record->remark}}</td>
                        <td>{{ $loop->iteration }}</td>
                        <td>New Submitted Job</td>
                        <td>{{$record->created_at}}</td>
                        <td>{{$record->updated_at}}</td>
                    </tr>
                    @endforeach

                    @if(!is_null($success))
                    <tr bgcolor="#c4c0c0" id="$success{{$success->id}}">
                        <td>{{$success->stu_id}}</td>
                        <td>{{$success->remark}}</td>
                        <td>-</td>
                        <td>Recent Job Complete</td>
                        <td>{{$success->created_at}}</td>
                        <td>{{$success->updated_at}}</td>
                    </tr>
                    @endif
                </tbody>
            </table>  
            
		</div>
</section>
@stop
