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

class checkingController extends Controller
{
  public function show(){
    	$clauses = [['id','>=','1']];
   	  	$records = record_tbl::where($clauses)->orderBy('id', 'DESC')->get();
    	
    	return view('pages.checking',array('records'=>$records));
    	}
  public function index(Request $request)
    {
    	$clauses = [['id','>=','1']];
   	  	$stu_id = $request->input('stu_id');
   	  	$in = ['stu_id','=',$stu_id];
   	  	array_push($clauses, $in);
   	  	$records = record_tbl::where($clauses)->orderBy('id', 'DESC')->get();
   	  	return view('pages.checking',array('records'=>$records));
    }
}
