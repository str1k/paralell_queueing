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

class queueController extends Controller
{
    public function show(){
    	$clauses = [['status','=','N']];
   	  	$records = record_tbl::where($clauses)->get();
   	  	$clauses = [['status','=','P']];
   	  	$running = record_tbl::where($clauses)->get();
   	  	$clauses = [['status','=','S']];
   	  	$success = record_tbl::where($clauses)->orderBy('created_at', 'DESC')->first();
   	  	$clauses = [['status','=','D']];
   	  	$destroyer = record_tbl::where($clauses)->orderBy('created_at', 'DESC')->first();
    	return view('pages.queue',array('records'=>$records,'running'=>$running,'success'=>$success,'destroyer'=>$destroyer));
    	}
}
