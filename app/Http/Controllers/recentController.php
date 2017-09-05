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

class recentController extends Controller
{
    public function show(){
    	$clauses = [['status','=','S']];
   	  	$records = record_tbl::where($clauses)->orderBy('id', 'DESC')->get();
    	
    	return view('pages.recent',array('records'=>$records));
    	}
}
