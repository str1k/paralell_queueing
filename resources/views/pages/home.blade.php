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
				<div class="col-lg-3"></div>
            	<div class="col-lg-6">
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
                	Submitting Parallel Job
                	</h1>
            	</div>
        	</div>
        	{!! Form::open(array('url'=>'/','method'=>'POST', 'files'=>true)) !!}
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
                		<div class="col-lg-4">
                		</div>
                		<div class="col-lg-4">
                    		<div class="form-group">
                    			<div class="col-lg-10">
                               		<label>Password</label>
                                	<input class="form-control"  type="password" placeholder="Your Password" name='pass'>
                            	</div>
                    		</div>
                    		<div class="col-lg-4">
                			</div>
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
                                	<label>Upload Your Code</label>
                                	{!! Form::file('code') !!}
                    			</div>
                    		</div>
                		</div>
                		<div class="col-lg-4"></div>
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
                               		<label>Remark</label>
                                	<input class="form-control"  placeholder="Example, '1st run'" name='remark'>
                            	</div>
                    		</div>
                    		<div class="col-lg-4">
                			</div>
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
                                {!! Form::submit('Submit Code to Queue', array('class'=>'btn btn-success')) !!}
                    			</div>
                    		</div>
                		</div>
                		<div class="col-lg-4"></div>
                    </div> 
                </div>    	
            </div>
                <!-- /.row -->
                {!! Form::close() !!}
		</div>
</section>
@stop