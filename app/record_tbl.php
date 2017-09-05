<?php

namespace App;

use Illuminate\Database\Eloquent\Model;

class record_tbl extends Model
{
protected $connection = 'mysql';
  protected $primaryKey = 'id';
  protected $table = 'record_tbls';
  protected $fillable = array(
        'stu_id',
        'remark',
        'correctness',
        'process_log_path',
        'compile_status',
        'timer'
  );

  public $timestamps = true;
}