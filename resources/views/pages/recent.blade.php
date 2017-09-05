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
                	RECENT COMPLETED JOB
                	</h1>
            	</div>
        	</div>
        	<div class="table-responsive">
            <table class="table">
                <thead>
                    <tr>
                    	<th>Record No.</th>
                        <th>ID</th>
                        <th>Remark</th>
                        <th>Time(Sec)</th>
                        <th>Compiled</th>
                        <th>Process log</th>
                        <th>Correctness</th>
                        <th>Time Submitted</th>
                    </tr>
                </thead>
                <tbody id="countries-list" name="countries-list">
                    @foreach ($records as $record)
                    
                    <tr id="record{{$record->id}}">
                    	<td>{{$record->id}}</td>
                        <td>{{$record->stu_id}}</td>
                        <td>{{$record->remark}}</td>
                        <td>{{$record->timer}}</td>
                        @if($record->compile_status == 1 )
                            <td><span style="color:#77B900" class="glyphicon glyphicon-ok" aria-hidden="true"></span></td>
                        @endif
                        @if($record->compile_status != 1 )
                            <td><span style="color:#ED0034" class="glyphicon glyphicon-remove" aria-hidden="true"></span></td>
                        @endif
                        <td><a href="{{$record->process_log_path}}" style="color:#2082EF" >{{$record->process_log_path}}</a></td>
                        @if($record->correctness == 1 )
                            <td><span style="color:#77B900" class="glyphicon glyphicon-ok" aria-hidden="true"></span></td>
                        @endif
                        @if($record->correctness != 1 )
                            <td><span style="color:#ED0034" class="glyphicon glyphicon-remove" aria-hidden="true"></span></td>
                        @endif
                        <td>{{$record->created_at}}</td>
                    </tr>
                    @endforeach
                </tbody>
            </table>  
            
		</div>
</section>
@stop