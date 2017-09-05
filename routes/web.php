<?php

/*
|--------------------------------------------------------------------------
| Web Routes
|--------------------------------------------------------------------------
|
| Here is where you can register web routes for your application. These
| routes are loaded by the RouteServiceProvider within a group which
| contains the "web" middleware group. Now create something great!
|
*/
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
Route::get('/', 'homeController@show');
Route::post('/','homeController@index');
Route::get('/queue', 'queueController@show');
Route::get('/ranking', 'rankController@show');
Route::get('/recent', 'recentController@show');
Route::get('/check','checkingController@show');
Route::post('/check','checkingController@index');