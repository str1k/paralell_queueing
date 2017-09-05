<?php

use Illuminate\Support\Facades\Schema;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Migrations\Migration;

class CreateRecordTblsTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('record_tbls', function (Blueprint $table) {
            $table->increments('id');
            $table->string('stu_id', 11);
            $table->string('remark', 32)->nullable();
            $table->string('output_path', 500)->nullable();
            $table->boolean('correctness')->nullable();
            $table->string('process_log_path', 500)->nullable();
            $table->boolean('compile_status')->nullable();
            $table->double('timer', 10, 5)->nullable();
            $table->string('status',1);
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::dropIfExists('record_tbls');
    }
}
