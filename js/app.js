$(document).ready(function(){
  cardapio.eventos.init();
})

let cardapio = {};

let MEU_CARRINHO = []

cardapio.eventos = {
  init: () =>{
    cardapio.metodos.obterItensCardapio();
  }
}

cardapio.metodos = {


  // obtem a lista de itens do cardapio
  obterItensCardapio: (categoria = 'burgers', vermais = false) =>{
    let filtro = MENU[categoria]

    

    if(!vermais){
      $('#itensCardapio').html('')
      $('#btnVerMais').removeClass('hidden')
    }

    $.each(filtro, (i, e) =>{

      let temp = cardapio.templates.item
      .replace(/\${img}/g, e.img)
      .replace(/\${id}/g, e.id)
      .replace(/\${name}/g, e.name)
      .replace(/\${price}/g, e.price.toFixed(2).replace('.', ','));
      
      // botão mais foi clicaco
      if (vermais && i >= 8 && i < 12){
        $('#itensCardapio').append(temp)
      }

      // Páginação inicial
      if(!vermais && i < 8){
        $('#itensCardapio').append(temp)
      }
    })

    //remove o ativo
    $('.container-menu a').removeClass('active');

    // adiciona o ativo
    $('#menu-' + categoria).addClass('active');
  },

  // clique no botão de ver mais
  verMais: () =>{
    let ativo = $('.container-menu a.active').attr('id').split('menu-')[1];
    cardapio.metodos.obterItensCardapio(ativo, true);

    $('#btnVerMais').addClass('hidden');
  }, 

  // Diminuir a quantidade
  diminuirQuantidade: (id) => {
    let qntdAtual = parseInt($('#qntd-' + id).text());

    if (qntdAtual > 0) {
      $('#qntd-' + id).text(qntdAtual - 1);
    }
  },

   // Diminuir a quantidade
  aumentarQuantidade: (id)=>{
    let qntdAtual = parseInt($('#qntd-' + id).text());

    $('#qntd-' + id).text(qntdAtual + 1);
  },

  // adicionar ao carrinho o item do cardápio
  adicionarAoCarrinho: (id) =>{
    let qntdAtual = parseInt($('#qntd-' + id).text());

    if(qntdAtual > 0){

      // Obter a categoria ativa
      let categoria = $('.container-menu a.active').attr('id').split('menu-')[1];

      // obtem  lista de items
      let filtro  = MENU[categoria]

      // obtem o item
      let item = $.grep(filtro, (e, i) => {return e.id == id});

      if(item.length > 0){

        // VALIDAR SE JÁ EXISTE ESSE ITEM NO CARRINHO
        let existe = $.grep(MEU_CARRINHO, (elem, index) => {
          return elem.id == id});

          // Caso ja exista o item no carrinho, só altera a quantidade
          if(existe.length > 0) {
            let objIndex = MEU_CARRINHO.findIndex((obj => obj.id == id))
            MEU_CARRINHO[objIndex].qntd = MEU_CARRINHO[objIndex].qntd + qntdAtual;
          } 
          // caso não exista o item no carrinho, adiciona ele
          else{
            item[0].qntd = qntdAtual
            MEU_CARRINHO.push(item[0])
          }


          cardapio.metodos.mensagem('Item adicionado ao carrinho!', "green")
          $('#qntd-' + id).text(0)
          cardapio.metodos.atualizarBadgeTotal()
      }
    } 
  },
  // atualiza o badge de totais dos botoes "meu carrinho"
  atualizarBadgeTotal: () => {
    let total = 0

    $.each(MEU_CARRINHO, (i, e) => {
      total += e.qntd
    })  
    if(total > 0){
      $(".botao-carrinho").removeClass("hidden")
      $(".container-total-carrinho").removeClass("hidden")
    }else{
      $(".botao-carrinho").addClass("hidden")
      $(".container-total-carrinho").addClass("hidden")
    }

    $(".badge-total-carrinho").html(total)
  },


  // ABRIR A MODAL CARRINHO
  abrirCarrinho: (abrir) =>{
    if(abrir){
      $('#modalCarrinho').removeClass('hidden');
      cardapio.metodos.carregarCarrinho();
    }else {
      $('#modalCarrinho').addClass('hidden');
    }
  },

// altera os textos e exibe os botoes da etapa
  carregarEtapa: (etapa) =>{
  if(etapa == 1) {
    $('#lblTituloEtapa').text('Seu carrinho:');
    $('#itensCarrinho').removeClass('hidden');
    $('#localEntrega').addClass('hidden');
    $('#resumoCarrinho').addClass('hidden');
    
    
    $('.etapa').removeClass('active');
    $('.etapa-1').addClass('active');

    $('#btnEtapaPedido').removeClass('hidden');
    $('#btnEtapaEndereco').addClass('hidden');
    $('#btnEtapaResumo').addClass('hidden');
    $('#btnVoltar').addClass('hidden');
    
  }if(etapa == 2){

    $('#lblTituloEtapa').text('Endereço de Entrega:');
    $('#itensCarrinho').addClass('hidden');
    $('#localEntrega').removeClass('hidden');
    $('#resumoCarrinho').addClass('hidden');
    
    
    $('.etapa').removeClass('active');
    $('.etapa-1').addClass('active');
    $('.etapa-2').addClass('active');

    $('#btnEtapaPedido').addClass('hidden');
    $('#btnEtapaEndereco').removeClass('hidden');
    $('#btnEtapaResumo').addClass('hidden');
    $('#btnVoltar').removeClass('hidden');

  } if(etapa == 3){
    $('#lblTituloEtapa').text(' Resumo do pedido:');
    $('#itensCarrinho').addClass('hidden');
    $('#localEntrega').addClass('hidden');
    $('#resumoCarrinho').removeClass('hidden');
    
    
    $('.etapa').removeClass('active');
    $('.etapa-1').addClass('active');
    $('.etapa-2').addClass('active');
    $('.etapa-3').addClass('active');

    $('#btnEtapaPedido').addClass('hidden');
    $('#btnEtapaEndereco').addClass('hidden');
    $('#btnEtapaResumo').removeClass('hidden');
    $('#btnVoltar').removeClass('hidden');
  }
  },

// botão de voltar etapa
  voltarEtapa: () =>{
      let etapa = $('.etapa.active').length;
      cardapio.metodos.carregarEtapa(etapa - 1);
  },

// carrega lista de itens do carrinho
  carregarCarrinho: () =>{
    cardapio.metodos.carregarEtapa(1);

    if(MEU_CARRINHO.length > 0){
      $('#itensCarrinho').html('');
      $.each(MEU_CARRINHO, (i, e) => {
        
        let temp = cardapio.templates.itensCarrinho
        .replace(/\${img}/g, e.img)
        .replace(/\${id}/g, e.id)
        .replace(/\${name}/g, e.name)
        .replace(/\${price}/g, e.price.toFixed(2).replace('.', ','))
        .replace(/\${qntd}/g, e.qntd);

        $('#itensCarrinho').append(temp);
        

      });
    } else {
      $('#itensCarrinho').html('<p class="carrinho-vazio"><i class="fa fa-shopping-bag"></i>Seu carrinho está vazio.</p>');
    }

  },


  // diminui a quantidade do carrinho
  diminuirQuantidadeCarrinho: (id) =>{
    let qntdAtual = parseInt($('#qntd-carrinho-' + id).text());

    if (qntdAtual > 1) {
      $('#qntd-carrinho-' + id).text(qntdAtual - 1);
      cardapio.metodos.atualizarCarrinho(id, qntdAtual - 1)
    }
    else {
      cardapio.metodos.removerItemCarrinho(id)
    }
  },


  // diminui a quantidade do carrinho
  aumentarQuantidadeCarrinho: (id) =>{
    let qntdAtual = parseInt($('#qntd-carrinho-' + id).text());
      $('#qntd-carrinho-' + id).text(qntdAtual + 1);
      cardapio.metodos.atualizarCarrinho(id, qntdAtual + 1)


  },

  // Botão remover item do carrinho
  removerItemCarrinho: (id) =>{
    MEU_CARRINHO = $.grep(MEU_CARRINHO, (e, i) => {return e.id != id});
    cardapio.metodos.carregarCarrinho();

    // atualiza o botao carinho com a qualidade atualizada
    cardapio.metodos.atualizarBadgeTotal()
  },

  // atualiza o carrinho com a quantidade atual
  atualizarCarrinho: (id, qntd) =>{
    let objIndex = MEU_CARRINHO.findIndex((obj => obj.id == id));
      MEU_CARRINHO[objIndex].qntd = qntd;


      // atualiza o botao carinho com a qualidade atualizada
      cardapio.metodos.atualizarBadgeTotal()
  }





  // mensagens

  ,mensagem: (texto, cor = 'red', tempo = 3000) => {
    
    let id = Math.floor(Date.now() * Math.random()).toString();

    let msg = `<div id="msg-${id}" class="animated fadeInDown toast ${cor}">${texto}</div>`

    $("#containerMensagens").append(msg);

    setTimeout(() =>{

      $("#msg-" + id).removeClass('fadeInDown');
      $("#msg-" + id).addClass('fadeOutUp');
      setTimeout(() => {
        $("#msg-" + id).remove();
      }, 800)
      
    }, tempo)
  }
}





cardapio.templates = {
  item: `
  <div class="col-3 mb-5">
              <div class="card card-item" id="\${id}">
                <div class="img-produto">
                  <img src="\${img}">
                </div>
                <p class="title-produto bold text-center mt-4">\${name}</p>
                <p class="price-produto text-center bold">
                  R$\${price}
                </p>
                <div class="add-carrinho">
                  <span class="btn-menos" onclick="cardapio.metodos.diminuirQuantidade('\${id}')"><i class="fas fa-minus"></i></span>
                  <span class="add-numero-itens" id="qntd-\${id}">0</span>
                  <span class="btn-mais" onclick="cardapio.metodos.aumentarQuantidade('\${id}')"><i class="fas fa-plus"></i></span>
                  <span class="btn btn-add" onclick="cardapio.metodos.adicionarAoCarrinho('\${id}')"><i class="fa fa-shopping-bag"></i></span>
                </div>
              </div>
            </div>
  `,
  itensCarrinho: `
            <div class="col-12 item-carrinho">
              <div class="img-produto">
                <img src="\${img}">
              </div>
              <div class="dados-produto">
                <p class="bold title-produto">
                  \${name}
                </p>
                <p class="bold price-produto">
                  R$\${price}
                </p>
              </div>
              <div class="add-carrinho">
                <div class="add-carrinho">
                  <span class="btn-menos" onclick="cardapio.metodos.diminuirQuantidadeCarrinho('\${id}')"><i class="fas fa-minus"></i></span>

                  <span class="add-numero-itens" id="qntd-carrinho-\${id}">\${qntd}</span>

                  <span class="btn-mais" onclick="cardapio.metodos.aumentarQuantidadeCarrinho('\${id}')"><i class="fas fa-plus"></i></span>

                  <span class="btn btn-remove" onclick="cardapio.metodos.removerItemCarrinho('\${id}')"><i class="fa fa-times"></i></span>
              </div>
            </div>
  `
}