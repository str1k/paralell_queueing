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
                	RANKING
                	</h1>
            	</div>
        	</div>
        	<div class="table-responsive">
            <table class="table">
                <thead>
                    <tr>
                    	<th>Rank</th>
                        <th>ID</th>
                        <th>Remark</th>
                        <th>Time(Sec)</th>
                        <th>Compiled</th>
                        <th>Correctness</th>
                        <th>Time Submitted</th>
                    </tr>
                </thead>
                <tbody id="countries-list" name="countries-list">
                    @foreach ($records as $record)
                    
                    <tr id="record{{$record->id}}">
                    	@if($loop->iteration == 1)
                    	<td >{{$loop->iteration}}<span style="color:#F7DD16" class="glyphicon glyphicon-king" aria-hidden="true"></span></td>
                    	@endif
                    	@if($loop->iteration != 1)
                    	<td>{{$loop->iteration}}</td>
                    	@endif	

                    	
                        <td>{{$record->stu_id}}</td>
                        <td>{{$record->remark}}</td>
                        <td>{{$record->timer}}</td>
                        <td><span style="color:#77B900" class="glyphicon glyphicon-ok" aria-hidden="true"></span></td>
                        <td><span style="color:#77B900" class="glyphicon glyphicon-ok" aria-hidden="true"></span></td>
                        <td>{{$record->created_at}}</td>
                    </tr>
                    @endforeach
                </tbody>
            </table>  
            
		</div>
</section>
@stop