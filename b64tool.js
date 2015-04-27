var b64map = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/";
var b64mapr = Array( 128 );

(function makermap(){
	var i;
	for ( i = 0; i < 64; i++ )
		b64mapr[ b64map.charCodeAt( i ) ] = i;
	b64mapr[ 0x3d ] = 0; // '='
})( );

function batob64(ba){ // byte array to base64 string
	var a = "";
	var l = ba.length;
	var i = 0, c = 0, kcount = 0, ia = 0;
	
	while ( i < l ) {
		c = (( c << 8 ) | ( ba[ i++ ] & 0xff ));
		kcount++;
		if ( kcount >= 3 ){
			kcount = 0;
			a += b64map.charAt( ( c >>> 18 ) & 0x3f );
			a += b64map.charAt( ( c >>> 12 ) & 0x3f );
			a += b64map.charAt( ( c >>> 6 ) & 0x3f );
			a += b64map.charAt( c & 0x3f );
		}
	}
	if ( kcount == 1 ){
		c = c << 16;
		a += b64map.charAt( ( c >>> 18 ) & 0x3f );
		a += b64map.charAt( ( c >>> 12 ) & 0x3f );
		a += "==";
	} else if ( kcount == 2 ) {
		c = c << 8;
		a += b64map.charAt( ( c >>> 18 ) & 0x3f );
		a += b64map.charAt( ( c >>> 12 ) & 0x3f );
		a += b64map.charAt( ( c >>> 6 ) & 0x3f );
		a += "=";
	}
	return a;
}

function b64toba(s){ // base64 string to byte array
	var a = new Array();
	var l = s.length;
	var k, i = 0, c = 0, kcount = 0, k3d = 0, ia = 0;

	while ( i < l ){
		k = s.charCodeAt( i++ );
		if ( ( k == 0x0a ) || ( k == 0x0d ) )
			continue;
		if ( k == 0x3d ) // "="
			k3d++;
		c = ( ( c << 6 ) | b64mapr[ k ] );
		kcount++;
		if ( kcount >= 4 ) {
			kcount = 0;
			a[ ia++ ] = ( ( c >>> 16 ) & 0xff );
			if ( k3d < 2 )
				a[ ia++ ] = ( ( c >>> 8 ) & 0xff );
			if ( k3d < 1 )
				a[ ia++ ] = ( c & 0xff );
		}
	}
	return a;
}
function b64toba2(s){
	var a = new Array();
	var c = new Array(4);
	var c1, s1;
	
	var i = 0;
	var l = s.length;
	var k, kcount;
	var ia;

	ia = 0;
	kcount = 0;
	s1 = "";
	while ( i < l ){
		c1 = s.charAt( i );
		k = s.charCodeAt( i++ );
		if ( ( k == 0x0a ) || ( k == 0x0d ) )
			continue;
		if ( k == 0x3d ) { // "="
			// here is the last byte(s)
			if ( kcount == 2 ) { //two "="
				a[ ia++ ] = ( ( c[ 0 ] << 2 ) | ( c[ 1 ] >>> 4 ) ) & 0xff;
			}
			else { //one "="
				a[ ia++ ] = ( ( c[ 0 ] << 2 ) | ( c[ 1 ] >>> 4 ) ) & 0xff;
				a[ ia++ ] = ( ( c[ 1 ] << 4 ) | ( c[ 2 ] >>> 2 ) ) & 0xff;
			}
			break;
		}
		s1 += c1;
		c[ kcount ] = b64mapr[ k ];
		kcount++;
		if ( kcount >= 4 ) {
			kcount = 0;
			s1 = "";
			// decode 4 chars
			// k is reused now
			a[ ia++ ] = ( ( c[ 0 ] << 2 ) | ( c[ 1 ] >>> 4 ) ) & 0xff;
			a[ ia++ ] = ( ( c[ 1 ] << 4 ) | ( c[ 2 ] >>> 2 ) ) & 0xff;
			a[ ia++ ] = ( ( c[ 2 ] << 6 ) | c[ 3 ] ) & 0xff;
		}
	}
	
	return a;
}
function toVisible(m){
	m &= 0xff;
	if ( ( m & 0x60 ) == 0 )
		m = 0x2e; //"."
	if ( m > 127 )
		m = 0x2e; //"."
	return m;
}
function dumphex( ba, $ll ) { // input is a byte array, output string to be displayed
	var ha = "0123456789ABCDEF";
	
	var s = "";
	var i, j, k, m;
	j = 0;
	for ( j = 0; j < ba.length; j += $ll ) {
		s += ha[ ( j >>> 12 ) & 15 ] + ha[ ( j >>> 8) & 15 ] + ha[ ( j >>> 4 ) & 15 ] + ha[ j & 15 ] + ": ";
		for ( i = 0, k = j; i < $ll; i++) {
			m = ba[ k ] & 0xff;
			s += ha[ m >>> 4 ] + ha[ m & 15 ];
			s += ( i == 7 ) ? "-" : " ";
			if ( ++k == ba.length )
				break;
		}

		for ( k = 1; k < $ll - i; k++ )
			s += "-- ";
		
		s += " ";
		
		for ( i = 0, k = j; i < $ll; i++) {
			m = ba[ k ] & 0xff;
			s += String.fromCharCode( toVisible( m ) );
			if ( ++k == ba.length )
				break;
		}
		
		s += "\n";
	} // for j
	return s;
}

