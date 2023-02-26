document.addEventListener( 'DOMContentLoaded', () => {
	'use strict'

	toggleBurgerMenu()
	headerScroll()
	smoothScrollForAnchors()
	submitForm( '.form' )
	callRegistrationPopup()
	callEnterPopup()
} )

let windowHeight = window.innerHeight
const getWindowHeight = () => windowHeight
const isInScope = ( elementSelector, st, offset = 0 ) => {
	const element  = document.querySelector( elementSelector )
	if ( ! element) return
	let bodyRect  = document.body.getBoundingClientRect(),
		elemRect  = element.getBoundingClientRect(),
		elemTop    = elemRect.top - bodyRect.top

	if( ! element ) return

	return st >= (elemTop - getWindowHeight() + offset) && st <= (elemTop + element.clientHeight - offset)
}

const toggleBurgerMenu = () => {
	const burgerMenu   = document.querySelector( '.header-wrapper' )
	const burgerBtn    = document.querySelector( '.burger-button' )

	if( ! burgerMenu || ! burgerBtn ) return

	burgerBtn.addEventListener( 'click', () => {

		if( ! burgerMenu.classList.contains( 'active') ) {
			burgerMenu.classList.add( 'active' )
			burgerBtn.classList.add( 'opened' )
		} else {
			burgerBtn.classList.remove( 'opened' )	
			burgerMenu.classList.remove( 'active' )
		}
	} )

	document.addEventListener( 'click', e => {
		e.stopPropagation()
		const target = e.target

		if (
			! target.className ||
			target.classList.contains( 'burger-menu' ) ||
			target.classList.contains( 'burger-button' )
		) return

		burgerMenu.classList.remove( 'active' )
		burgerBtn.classList.remove( 'opened' )
	} )

	window.addEventListener( 'resize', () => {
		const windowWidth = window.innerWidth
		const WINDOW_WIDTH_MD = 992
	
		if( windowWidth >= WINDOW_WIDTH_MD &&  burgerMenu.classList.contains( 'active' ) ) {
			burgerMenu.classList.remove( 'active' )
			burgerBtn.classList.remove( 'opened' )
		}
	} )
}

const headerScroll = () => {
    window.addEventListener('scroll', () => {
        const scrollTop = window.scrollY
        const header = document.querySelector( '.header' )

		if( ! header ) return

        if ( scrollTop > 0 ) {
            if ( ! header.classList.contains( 'scrolled' ) )
                header.classList.add( 'scrolled' )
		}   else {
            header.classList.remove( 'scrolled' )
        }
    })
}

const smoothScrollForAnchors = () => {
	const anchors = document.querySelectorAll( '.anchor' )
		if ( ! anchors ) return

		for ( let anchor of anchors ) {
			anchor.addEventListener( 'click', function ( e ) {
				e.preventDefault()

			const blockID = anchor.getAttribute( 'href' ).substring( 1 )

			document.getElementById( blockID ).scrollIntoView( {
				behavior: 'smooth',
				block: 'start'
			} )
		} )
	}
}

const submitForm = ( selector ) => {
	const forms	= document.querySelectorAll( selector )

	if( ! forms.length ) return

	forms.forEach( form => {
		form.addEventListener( 'submit', e => {
			e.preventDefault()

			const
				formResponse	= form.querySelector( '.form-response' ),
				request			= new XMLHttpRequest(),
				formData		= new FormData( form ),
				formType		= form.dataset.type

			formData.append( 'func', formType )
			request.open( 'post', 'send-form.php', true )
			request.responseType = 'json'

			formResponse.classList.remove( ['success', 'error'] )
			formResponse.textContent = 'Обработка...'

			request.addEventListener( 'load', () => {
				// All is good.
				if( request.status === 200 ){
					// Success response.
					if( request.response.success ){
						form.classList.add( 'success' )
						form.classList.remove( 'error' )
						form.innerHTML = request.response.message
					}	else {	// We've caught an error.
						formResponse.classList.remove( 'success' )
						formResponse.classList.add( 'error' )
						formResponse.textContent = request.response.message
					}
				}	else {	// All is bad.
					formResponse.classList.remove( 'success' )
					formResponse.classList.add( 'error' )
					formResponse.textContent = request.response
				}
			} )

			request.send( formData )
		} )
	} )
}

document.addEventListener( 'scroll', () => {
    const wait   = document.querySelector( '.wait' )
	const learn  = document.querySelector( '.learn')
	const whyWe  = document.querySelector( '.why-we')
	const price  = document.querySelector( '.price')
	const footer = document.querySelector( '.footer')

    if ( isInScope( '.wait', window.scrollY ) ) {
            wait.classList.add( 'scrolled' )
        }

	if ( isInScope( '.learn', window.scrollY ) ) {
		learn.classList.add( 'scrolled' )
	}

	if ( isInScope( '.why-we', window.scrollY ) ) {
		whyWe.classList.add( 'scrolled' )
	}

	if ( isInScope( '.price', window.scrollY ) ) {
		price.classList.add( 'scrolled' )
	}

	if ( isInScope( '.footer', window.scrollY ) ) {
		footer.classList.add( 'scrolled' )
	}
} )

const callRegistrationPopup = () => {
	const regButton  = document.querySelector( '.reg' )
	const regPopup   = document.querySelector( '.reg-popup' )
	const popupClose = document.querySelector( '.popup-close')

	regButton.addEventListener( 'click', () => {
		if( ! regPopup.classList.contains( 'opened' ) )
			regPopup.classList.add( 'opened' )
	} )

	popupClose.addEventListener( 'click', () => {
		if( regPopup.classList.contains( 'opened' ))
		regPopup.classList.remove( 'opened' )
	} )

	regPopup.addEventListener( 'click', e => {
		e.stopPropagation()

		const target = e.target

		if ( target.className && target.classList.contains( 'reg-popup' ) ) {
			regPopup.classList.remove( 'opened' )
		}
	} )
}

const callEnterPopup = () => {
	const enterButton = document.querySelector( '.enter' ) 
	const enterPopup  = document.querySelector( '.enter-popup' )
	const closeButton = document.querySelectorAll( '.popup-close' )

	enterButton.addEventListener( 'click', () => {
		if( ! enterPopup.classList.contains( 'opened' ) )
			enterPopup.classList.add( 'opened' )
	} )

	closeButton.forEach( btn => {
		btn.addEventListener( 'click', () => {
			if( enterPopup.classList.contains( 'opened' ))
			enterPopup.classList.remove( 'opened' )
		} )
	} )

	

	enterPopup.addEventListener( 'click', e => {
		e.stopPropagation()

		const target = e.target

		if ( target.className && target.classList.contains( 'enter-popup' ) ) {
			enterPopup.classList.remove( 'opened' )
		}
	} )
}


