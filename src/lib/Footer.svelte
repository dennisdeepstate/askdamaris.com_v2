<style>
    footer, .footer_main{
        box-sizing: border-box;
        width: 100%;
    }
    footer{
        background: var(--gradient);
        padding: 3px 0 0 0;
        z-index: 7;
    }
    .footer_main{
        background-color: var(--color_white_translucent);
        padding: 24px 0;
        z-index: 8;
    }
    .contacts{
        display: grid;
        grid-template-columns: 1fr 1fr;
        justify-items: center;
        margin: 0 auto;
        max-width: 840px;
        min-width: 360px;
        padding: 0;
        width: 90%
    }
    .contacts > ul{
        margin: 0;
        padding: 0;
    }
    .contacts > ul > li{
        margin: 4px 0;
        list-style-type: none;
    }
    .contacts > ul > li > a > i{
        margin: 0 12px 0 0;
    }
@media only screen and (max-width: 600px){
    .contacts{
        grid-template-columns: 1fr;
    }
}
</style>
<footer id="footer">
    <div class="footer_main">
        <div class="contacts">
            <ul>
                <li><a href="mailto:info@askdamaris.com"><i class="icofont-ui-email"></i>info@askdamaris.com</a></li>
                <li><a href="tel:+254791235334"><i class="icofont-phone"></i>+254791235334</a></li>
                <li><a href="https://wa.me/+254791235334" target="_blank" rel="noreferrer"><i class="icofont-whatsapp"></i>+254791235334</a></li>
            </ul>
            <ul>
                <li><a href="https://www.linkedin.com/in/damaris-kakundi-350284142" target="_blank" rel="noreferrer"><i class="icofont-linkedin"></i>Damaris Kakundi</a></li>
                <li><a href="https://www.instagram.com/ask_damaris/" target="_blank" rel="noreferrer"><i class="icofont-instagram"></i>@ask_damaris</a></li>
                <li><a href="https://www.youtube.com/@maishachapters" target="_blank" rel="noreferrer"><i class="icofont-youtube-play"></i>@maishachapters</a></li>
            </ul>
        </div>
    </div>
</footer>