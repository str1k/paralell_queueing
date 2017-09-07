<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use App\Http\Controllers\Controller;
use Illuminate\Support\Facades\Input;
use Illuminate\Support\Facades\Validator;
use Redirect;
use Session;
use App\record_tbl;
use App\simple_pass;
date_default_timezone_set("Asia/Bangkok");

class homeController extends Controller
{
    public function show(){
    	return view('pages.home');
    	}
    public function index(Request $request)
    {

     	$rules = array('stu_id' => 'bail|required',
         'remark' =>'nullable',
         'pass' => 'required',
         'code' => 'required');
     	$data  =  Input::except(array('_token'));
    	$messages = [
    'stu_id.required' => 'Please provide your student ID',
    'pass.required' => 'Please probide your password',
    'code.required' => 'Please upload your code in .c or .cpp extenstion',
	];
	$validator = Validator::make($data, $rules, $messages);

      if ($validator->fails()){
         return Redirect::back()->withInput(Input::all())->withErrors($validator);
      }
      $stu_id = $request->input('stu_id');
      $pass = $request->input('pass');
   	  $clauses = [['stu_id','=',$stu_id]];
   	  $result = simple_pass::where($clauses)->first();
      if(is_null($result)) {
      	return Redirect::back()->withInput(Input::all())->withErrors("Invalid Student ID");
      }
      if($result->pass != $pass){
      	return Redirect::back()->withInput(Input::all())->withErrors("Invalid Password");
      }
      $clauses = [['stu_id','=',$stu_id]];
      $in = ['status','=','N'];
      array_push($clauses, $in);
  	  $result2 = record_tbl::where($clauses)->first();
  	  if(!is_null($result2)){
  	  	return Redirect::back()->withInput(Input::all())->withErrors("You can re-submit job only when your previous submitted job has completed");	
  	  }
      else {
      	$code = array('code'=> Input::file('code'));
      	if (Input::file('code')->isValid()) {
         $destinationPath = '/nfs/code/recent'; // upload path
         $extension = Input::file('code')->getClientOriginalExtension(); // getting image extension
         $code_fileName = $stu_id.".c";
         Input::file('code')->move($destinationPath, $code_fileName);
         }
         else {
         // sending back with error message.
         Session::flash('error', 'uploaded code file is not valid');
         return Redirect::back()->withInput(Input::all());
         }
         $record = new record_tbl;
         $record->stu_id = $request->input('stu_id');
         $record->remark = $request->input('remark');
         $record->status = "N";
         $record->save();


         Session::flash('success', 'Added your code to queue'); 
         return Redirect::to('/queue');
      }
  }
}
