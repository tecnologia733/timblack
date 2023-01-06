'use strict';

// Evento obrigatório para o fechamento do modal.
window.addEventListener('message', function (e) {
    if (e.data == 'click!' || e.data == 'fechar!' || e.data == 'minimizar!') {
        var cdModal = document.getElementById('cdModal');
        document.body.removeChild(cdModal);
    }
});

// Descobre se o site onde está chamando usa http ou https
var prefixCD = 'https:' === document.location.protocol ? 'https://' : 'http://';
prefixCD = !prefixCD ? 'http://' : prefixCD;
var parametros = '';

// Função para pegar o valor de parametro passado pela url
function getParameterByName(name) {
    var match = RegExp('[?&]' + name + '=([^&]*)').exec(window.location.search);
    return match && decodeURIComponent(match[1].replace(/\+/g, ' '));
}

// Função para transformar variável de undefined para ''
function resolveNull(param) {
    param = param === undefined ? '' : param;
    return param;
}

// Função para pegar os parametros de UTMS e DDD do TIM Controle Express
function getParams() {
    parametros = getParameterByName('utm_source') ? parametros += '?utm_source=' + getParameterByName('utm_source') : parametros;
    parametros = getParameterByName('utm_medium') ? parametros += '&utm_medium=' + getParameterByName('utm_medium') : parametros;
    parametros = getParameterByName('utm_term') ? parametros += '&utm_term=' + getParameterByName('utm_term') : parametros;
    parametros = getParameterByName('utm_content') ? parametros += '&utm_content=' + getParameterByName('utm_content') : parametros;
    parametros = getParameterByName('utm_campaign') ? parametros += '&utm_campaign=' + getParameterByName('utm_campaign') : parametros;
    parametros = getParameterByName('ddd') ? parametros += '&ddd=' + getParameterByName('ddd') : parametros;
};

// Atrela o Google Analytics à URL
function url_decorate(src) {
    var gobj = window[window.GoogleAnalyticsObject];
    if (gobj) return (new window.gaplugins.Linker(gobj.getAll()[0])).decorate(src);
    else return src;
}

function autoOpen() {
    var open = getParameterByName('openCD');

    if (open) {
        switch (open) {

        }
    }
}

function retomar() {
    var urlModal = '',
        retomada = getParameterByName('retomadaCD');

    if (retomada) {
        var amb = getParameterByName('ambCD'),
            uid = '831e7660626a48ca828462bf738f376d' || getParameterByName('uid'),
            crmCampaign = getParameterByName('crm_campaign'),
            utm_source = getParameterByName('utm_source');

        switch (amb) {
            case 'L':
                urlModal = prefixCD + 'localhost:3000/upload?uid=' + uid;
                break;
            case 'D':
                urlModal = prefixCD + 'dev.timprospect.cd.com/upload?uid=' + uid;
                break;
            case 'H':
                urlModal = prefixCD + 'hmg.timprospect.cd.com/upload?uid=' + uid;
                break;
            case 'HI':
                urlModal = prefixCD + 'hmg-timprospect.celulardireto.com.br/upload?uid=' + uid;
                break;
            default:
                urlModal = prefixCD + 'prospect-corp-tim.celulardireto.com.br/upload?uid=' + uid;
                break;
        }

        if (screen.width <= 840) {
            urlModal = urlModal.replace('timmodalcontrole.celulardireto', 'controle.tim');
            window.open(urlModal, '_blank', false);
        } else generateModal(urlModal, 830, 630, false, true);
    }
}

// Modal Tim Prospect
function abreModalTimEmpresas(item) {
    var ddd = item.getAttribute('data-ddd');
    var modalidade = item.getAttribute('data-modalidade');
    var sku = item.getAttribute('data-sku');
    var uf = item.getAttribute('data-uf');
    var utms = item.getAttribute('data-utms');
    var urlModal = '';
    var amb = getParameterByName('ambCD'); // Ambiente que ele deve carregar. Valores: local, homolog. Caso não tenha nenhum, abre produção.

    ddd = resolveNull(ddd);
    modalidade = resolveNull(modalidade);
    sku = resolveNull(sku);
    uf = resolveNull(uf).toUpperCase();
    utms = resolveNull(utms);

    switch (amb) {
        case 'L':
            urlModal = prefixCD + 'localhost:3000/simulador';
            break;
        case 'B':
            urlModal = prefixCD + 'localhost:8080/simulador';
            break;
        case 'D':
            urlModal = prefixCD + 'dev.tim-empresas.cd.com/simulador';
            break;
        case 'H':
            urlModal = prefixCD + 'hmg.tim-empresas.cd.com/simulador';
            break;
        case 'HI':
            urlModal = prefixCD + 'hmg.tim-empresas.wooza.com.br:8090/simulador';
            break;
        default:
            urlModal = prefixCD + 'tim-empresas.wooza.com.br/simulador';
            break;
    }

    sku.indexOf('_NOVA_LINHA') > 0 ? urlModal += '?sku=' + sku + '&ddd=' + ddd + '&modalidade=' + modalidade + '&utms=' + utms : urlModal += '?sku=' + sku + uf + '_NOVA_LINHA' + '&ddd=' + ddd + '&modalidade=' + modalidade + '&utms=' + utms;

    if (screen.width <= 840) {
        urlModal = url_decorate(urlModal);
        window.open(urlModal, '_blank', false);
    } else {
        // Medidas do Modal
        var modalWidth = 830,
            modalHeight = 630;

        generateModal(urlModal, modalWidth, modalHeight, false, true);
    }
}

// Função que gera a estrutura do modal de acordo com os dados passados.
function generateModal(url, width, height, chat, ga) {
    var mainDiv = document.createElement('div');
    mainDiv.setAttribute('style', 'background-color: rgba(0,0,0,.6); height: 100%; left: 0; position: fixed; top: 0; width: 100%; z-index: 314748363000');
    mainDiv.id = 'cdModal';

    // Calcula posicionamento do modal.
    var left = width / 2,
        top = height / 2;

    width = chat ? width + 315 : width;
    url = ga ? url_decorate(url) : url;

    var mainIframe = document.createElement('iframe');
    mainIframe.src = url;
    mainIframe.setAttribute('style', 'border: none; height: ' + height + 'px; left: calc(50% - ' + left + 'px); position: absolute; top: calc(50% - ' + top + 'px); width: ' + width + 'px;');

    mainDiv.appendChild(mainIframe);
    document.body.appendChild(mainDiv);
}

getParams();
retomar();
autoOpen();
