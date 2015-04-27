<?php

function debuginfo(){
	$fi = fopen( "file:///dev/pts/0", "wt" );
	//fwrite( $fi, gettype( $_POST[ "POST1" ] ) );

	fwrite( $fi, "\x1b[2J" ); // clear screen

	fwrite( $fi, "\x1b[3;40H" ); // move cursor to ( 1, 40 )
	fwrite( $fi, "\x1b[30;102m");
	fwrite( $fi, `date`.PHP_EOL );
	fwrite( $fi, "\x1b[30;107m");
	fwrite( $fi, "\x1b[4;40H" ); // move cusor to next row

	$tm = microtime();
	fwrite( $fi, 'time():'.$tm );
	fwrite( $fi, "\x1b[5;40H" ); // move cusor to next row
	$ti1 = ((int)( $tm * 10 ) % 6) + 1;
	
	$ti2 = ((int)( $tm * 100) % 2);
	if ($ti2 == 0)
		fwrite( $fi, "\x1b[30;10{$ti1}m");
	else
		fwrite( $fi, "\x1b[30;4{$ti1}m");
	fwrite( $fi, "                            " );
	fwrite( $fi, "\x1b[30;107m");
	

	$lno = 10;
	$lno++;	fwrite( $fi, "\x1b[{$lno};30H" ); // move cusor to next row
	
	foreach( $_POST as $pi => $pa ){
		$lno = 10;
		$lno++;	fwrite( $fi, "\x1b[{$lno};30H" ); // move cusor to next row
		fwrite( $fi, $pi."=>".$pa );
	}
	

	$lno++;	fwrite( $fi, "\x1b[{$lno};30H" ); // move cusor to next row
	fwrite( $fi, $_SERVER[ 'REQUEST_METHOD' ].PHP_EOL );

	$lno++;	fwrite( $fi, "\x1b[{$lno};30H" ); // move cusor to next row
	fwrite( $fi, $_SERVER[ 'PATH_INFO' ] );

	define("current_time", time());
	//print current_time;
	$lno++;	fwrite( $fi, "\x1b[{$lno};30H" ); // move cusor to next row
	fwrite( $fi, time());

	$lno++;	fwrite( $fi, "\x1b[{$lno};30H" ); // move cusor to next row
	fwrite( $fi, __FILE__."\n\r" );
	$lno++;	fwrite( $fi, "\x1b[{$lno};30H" ); // move cusor to next row
	fwrite( $fi, session_id() );
	$lno++;	fwrite( $fi, "\x1b[{$lno};30H" ); // move cusor to next row
	fwrite( $fi, PHP_VERSION );
	$lno++;	fwrite( $fi, "\x1b[{$lno};30H" ); // move cusor to next row
	fwrite( $fi, DEFAULT_INCLUDE_PATH );

	print `date`;

	fclose( $fi );
}

debuginfo();
?>

