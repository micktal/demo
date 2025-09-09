<div class="grid place-items-center">
  <div class="cube">
    <div class="face front"></div>
    <div class="face back"></div>
    <div class="face right"></div>
    <div class="face left"></div>
    <div class="face top"></div>
    <div class="face bottom"></div>
  </div>
</div>
<style>
  .cube{position:relative; width:140px; height:140px; transform-style:preserve-3d; animation:spin 6s linear infinite;}
  .face{position:absolute; width:140px; height:140px; background:linear-gradient(135deg, rgba(16,185,129,.3), #fff); border:1px solid rgba(0,0,0,.08);}
  .front{ transform: translateZ(70px); }
  .back{ transform: rotateY(180deg) translateZ(70px); }
  .right{ transform: rotateY(90deg) translateZ(70px); }
  .left{ transform: rotateY(-90deg) translateZ(70px); }
  .top{ transform: rotateX(90deg) translateZ(70px); }
  .bottom{ transform: rotateX(-90deg) translateZ(70px); }
  @keyframes spin{ from{ transform: rotateX(0deg) rotateY(0deg);} to{ transform: rotateX(360deg) rotateY(360deg);} }
</style>
