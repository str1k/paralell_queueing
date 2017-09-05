<?php

namespace App;

use Illuminate\Database\Eloquent\Model;

class simple_pass extends Model
{
protected $connection = 'mysql';
  protected $primaryKey = 'id';
  protected $table = 'simple_passes';
  protected $fillable = array(
        'stu_id',
        'pass',
  );
}
