<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use App\Http\Controllers\Controller;
use Illuminate\Support\Facades\Input;
use Illuminate\Support\Facades\Validator;
use Redirect;
use Session;
use App\ranking_tbl;
use App\simple_pass;

class rankController extends Controller
{
    public function show(){
    	$clauses = [['status','=','S']];
    	$in =['correctness','=',True];
        array_push($clauses, $in);
        $in =['compile_status','=',True];
        array_push($clauses, $in);
   	  	$records = ranking_tbl::where($clauses)->orderBy('timer', 'ASC')->get();
    	
    	return view('pages.rank',array('records'=>$records));
    	}
}
