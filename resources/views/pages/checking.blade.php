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
                    @if ($errors->any())
                        <?php echo implode('', $errors->all('<div class="form-group"><span  class="label label-danger">:message</span></div>')) ?>
                    @endif
                    @if(Session::has('success'))
                        <div class="alert-box success">
                            <span  class="label label-success">{!! Session::get('success') !!}</span>
                        </div>
                    @endif
                    @if(Session::has('error'))
                        <p class="errors">{!! Session::get('error') !!}</p>
                    @endif
                	<h1 class="page-header">
                	Self Checking
                	</h1>
            	</div>
        	</div>
            {!! Form::open(array('url'=>'/check','method'=>'POST', 'files'=>true)) !!}
            <div class="row">
                <div class="col-lg-12">
                    <div class="col-lg-4">
                    </div>
                    <div class="col-lg-4">
                        <div class="form-group">
                            <div class="col-lg-10">
                                <label>Student ID</label>
                                <input class="form-control" placeholder="Your Student ID" name='stu_id' value="{{ old('stu_id') }}">
                            </div>
                        </div>
                    </div>
                    <div class="col-lg-4">
                    </div>  
                </div>
                <div class="col-lg-12">
                        <label></label>
                </div>
                <div class="col-lg-12">
                    <div class="col-lg-4">
                    </div>
                    <div class="col-lg-4">
                        <div class="form-group">
                            <div class="col-lg-10">
                            {!! Form::submit('Check your self', array('class'=>'btn btn-success')) !!}
                            </div>
                        </div>
                    </div>
                    <div class="col-lg-4">
                    </div>
                </div>
                <div class="col-lg-12">
                        <label></label>
                </div> 
            </div>
            {!! Form::close() !!}
        	<div class="table-responsive">
            <table class="table">
                <thead>
                    <tr>
                    	<th>Record No.</th>
                        <th>ID</th>
                        <th>Remark</th>
                        <th>Time(Sec)</th>
                        <th>Compiled</th>
                        <th>Correctness</th>
                        <th>Process log</th>
                        <th>Status</th>
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
                        @if($record->compile_status == 1 && $record->status == 'S')
                            <td><span style="color:#77B900" class="glyphicon glyphicon-ok" aria-hidden="true"></span></td>
                        @endif
                        @if($record->compile_status != 1 && $record->status == 'S')
                            <td><span style="color:#ED0034" class="glyphicon glyphicon-remove" aria-hidden="true"></span></td>
                        @endif
                        @if($record->status != 'S')
                            <td><span style="color:#FEE101" class="glyphicon glyphicon-repeat" aria-hidden="true"></span></td>
                        @endif
                        @if($record->correctness == 1 && $record->status == 'S')
                            <td><span style="color:#77B900" class="glyphicon glyphicon-ok" aria-hidden="true"></span></td>
                        @endif
                        @if($record->correctness != 1 && $record->status == 'S')
                            <td><span style="color:#ED0034" class="glyphicon glyphicon-remove" aria-hidden="true"></span></td>
                        @endif
                        <td><a href="{{$record->process_log_path}}" style="color:#2082EF" >{{$record->process_log_path}}</a></td>
                        @if($record->status != 'S')
                            <td><span style="color:#FEE101" class="glyphicon glyphicon-repeat" aria-hidden="true"></span></td>
                        @endif
                        @if($record->status == 'N')
                            <td>Waiting in queue</td>
                        @endif
                        @if($record->status == 'P')
                            <td>Running</td>
                        @endif
                        @if($record->status == 'S')
                            <td>Completed</td>
                        @endif
                        <td>{{$record->created_at}}</td>
                    </tr>
                    @endforeach
                </tbody>
            </table>  
            
		</div>
</section>
@stop