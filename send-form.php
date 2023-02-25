<?php

/**
 * Clean incoming value from trash.
 *
 * @param	mixed	$value	Some value to clean.
 * @return	mixed	$value	The same value, but cleaned.
 */
function as_clean_value( $value )
{
	$value = trim( $value );
	$value = stripslashes( $value );
	$value = strip_tags( $value );

	return htmlspecialchars( $value );
}

/**
 * Function checks if value length is between min and max parameters.
 *
 * @param   string	$value  Specific string..
 * @param   int		$min    Minimum symbols value length.
 * @param   int		$max	Maximum symbols value length.
 * @return  bool            True if OK, false if value length is too small or large.
 */
function as_check_length( string $value, int $min, int $max ): bool
{
	return ! ( mb_strlen( $value ) < $min || mb_strlen( $value ) > $max );
}

/**
 * Function checks name symbols.
 *
 * @param   string  $name   Some name.
 * @return  bool            True if OK, false if string has bad symbols.
 */
function as_check_name( string $name ): bool
{
	return preg_match('/^[a-zа-я\s]+$/iu', $name );
}

/**
 * Function checks phone symbols.
 *
 * @param   string  $phone  Some phone number.
 * @return  bool            True if OK, false if string has bad symbols.
 */
function as_check_phone( string $phone ): bool
{
	return preg_match('/^[0-9()+\-\s]+$/iu', $phone );
}

if( ! empty( $_POST ) && isset( $_POST['func'] ) ){
	switch( $_POST['func'] ){
		case 'feedback':
			as_send_feedback_form();
			break;

		case 'promo':
			as_send_promo_form();
			break;

		default:
			as_send_popup_form();
	}
}

// Feedback.
function as_send_feedback_form(){
	$name		= isset( $_POST['name'] ) ? as_clean_value( $_POST['name'] ) : null;
	$tel		= isset( $_POST['phone'] ) ? as_clean_value( $_POST['phone'] ) : null;
	$question	= isset( $_POST['question'] ) ? as_clean_value( $_POST['question'] ) : null;
	$title		= 'Форма обратной связи';

	// Required fields.
	if( ! $name || ! $tel || ! $question ){
		echo json_encode( [
			'success'	=> 0,
			'message'	=> 'Пожалуйста, заполните все поля.'
		] );
		die();
	}

	// Only letters & spaces in name.
	if( ! as_check_name( $name ) ){
		echo json_encode( [
			'success'	=> 0,
			'message'	=> 'Пожалуйста, введите корректное имя.'
		] );
		die();
	}

	// Check length to avoid very large text.
	if( ! as_check_length( $name, 1, 50 ) ){
		echo json_encode( [
			'success'	=> 0,
			'message'	=> 'Имя не должно превышать 50 символов.'
		] );
		die();
	}

	if( ! as_check_length( $tel, 3, 30 ) ){
		echo json_encode( [
			'success'	=> 0,
			'message'	=> 'Телефон не должен превышать 30 символов или быть меньше 3 символов.'
		] );
		die();
	}

	// Check phone symbols.
	if( ! as_check_phone( $tel ) ){
		echo json_encode( [
			'success'	=> 0,
			'message'	=> 'Пожалуйста, введите корректный телефон.'
		] );
		die();
	}

	// Prepare message for mail.
	$message = "Привет!\n" .
		"{$title}:\n\n" .
		"Имя - $name\n" .
		"Телефон - $tel\n" .
		"Вопрос - $question\n\n\n";

	as_send_email( $title, $message );
}

/**
 * @param string $subject
 * @param string $message
 * @return void
 */
function as_send_email( string $subject, string $message ){
	// Mail headers.
	$headers = "From: no-reply@" . $_SERVER['HTTP_HOST'] . "\r\n" .
		"Reply-To: no-reply@" . $_SERVER['HTTP_HOST'] . "\r\n" .
		"X-Mailer: PHP/" . phpversion();

	$result = mail('baku_2004_aliev@mail.ru', $subject, $message, $headers );

	if( $result )
		echo json_encode( [
			'success'	=> 1,
			'message'	=> 'Спасибо за Ваше сообщение! Мы свяжемся с Вами в ближайшее время.'
		] );	// Success.
	else
		echo json_encode( [
			'success'	=> 0,
			'message'	=> 'Ошибка отправки. Пожалуйста, попробуйте позже.'
		] );	// Failed.
}

die();
