$ErrorActionPreference='Stop'
$utf8=New-Object System.Text.UTF8Encoding($false)
# arquivo | legenda | crédito | licença
$img=@{
'cpr'=@('Cardiopulmonary_Resuscitation_Adult.jpg','Posicionamento para compressões torácicas no adulto.','Illinois Waterway Visitor Center, US Army Corps of Engineers','Domínio público');
'cprbaby'=@('CardiopulmonaryResuscitationBabyDummy.jpg','Treino de RCP em manequim de lactente.','Uniformed Services University','Domínio público');
'aed'=@('Modern_AED_Automated_external_defibrillator.png','Desfibrilador Externo Automático (DEA).','VoLid27','CC0');
'aedpub'=@('Public_access_AED_with_coded_lock.jpg','DEA de acesso público em gabinete sinalizado.','Christian P. Nielsen','CC0');
'aedsign'=@('ISO_7010_E010.png','Sinal ISO 7010 E010: localização do DEA.','M!dgard','CC0');
'eyewash'=@('ISO_7010_E011.png','Sinal ISO 7010 E011: lava-olhos de emergência.','MaxxL','Domínio público');
'heimlich'=@('Abdominal_thrusts_against_choking_cropped_.jpg','Compressões abdominais (manobra de Heimlich).','US Army Medical Department Center and School','Domínio público');
'jaw'=@('Jaw_thrust.jpg','Tração da mandíbula (jaw thrust) para abertura de via aérea.','Department of the Army (EUA)','Domínio público');
'tq'=@('Tourniquet_application.jpg','Aplicação de torniquete em treinamento TCCC.','U.S. Navy, MC2 Barry R. Hirayama','Domínio público');
'splint'=@('Splinting-an-arm.png','Imobilização de braço com tala moldável.','Baedr-9439','CC0');
'collar'=@('Cervical-collar-application.png','Colocação de colar cervical.','Baedr-9439','CC0');
'bvm'=@('Bag-valve-mask.jpg','Bolsa-válvula-máscara (ambu).','Another-anon-artist-234','CC0');
'epi'=@('Epinephrine-injection.png','Uso de autoinjetor de adrenalina.','Baedr-9439','CC0');
'ana'=@('Signs_and_symptoms_of_anaphylaxis.png','Sinais e sintomas da anafilaxia.','Mikael Häggström','CC0');
'fast'=@('Identify_the_symptoms_of_a_stroke_using_the_FAST_method.png','Reconhecimento do AVC pelo método FAST.','U.S. Food and Drug Administration (vetor: Fvasconcellos)','Domínio público');
'actfast'=@('Act_FAST.png','Act FAST: sinais de alerta do AVC.','U.S. CDC, NCCDPHP','Domínio público');
'ext'=@('Fire_extinguisher.png','Extintor de incêndio.','OpenClipart','CC0');
'nfpa'=@('NFPA_704.png','Diamante de Hommel (NFPA 704).','Denelson83','Domínio público');
'loto'=@('Lockout_Tagout_14853353063_.jpg','Procedimento de bloqueio e etiquetagem (LOTO).','NAVFAC (U.S. Navy)','Domínio público');
'inhaler'=@('AsthmaInhaler.jpg','Inalador dosimetrado para asma.','Wikimedia Commons (Mendel, assumido)','Domínio público');
'heart'=@('Blausen_0463_HeartAttack.png','Infarto agudo do miocárdio.','Blausen Medical Communications, Inc.','CC BY 3.0 (https://creativecommons.org/licenses/by/3.0/)');
'confined'=@('Confined_Space_Entry_32884133734_.jpg','Tripé de extração para espaço confinado.','Georgia National Guard','CC BY 2.0 (https://creativecommons.org/licenses/by/2.0/)');
'samu'=@('Motolancias_SAMU_Distrito_Federal.jpg','Motolâncias do SAMU 192 (Distrito Federal).','Antonio Cruz/Agência Brasil','CC BY 3.0 BR (https://creativecommons.org/licenses/by/3.0/br/)')
}
$plan=@{
'C05'='cpr','bvm';'C06'='aed','aedpub','aedsign';'C07'='heimlich';'C04'='jaw';'C08'='fast','actfast','heart';
'C09'='epi','ana','inhaler';'C10'='tq';'C11'='splint','collar';'C03'='samu';
'E02'='cprbaby','cpr';'E03'='heimlich';'E04'='epi','ana';'E05'='splint';'E06'='epi','inhaler';
'A02'='aed','heart';'A03'='splint';'A06'='aed','aedpub';
'H05'='tq';'H07'='tq';
'T01'='loto';'T02'='loto';'T03'='bvm','eyewash','nfpa';'T04'='loto';'T05'='collar';'T06'='confined','bvm';'T07'='ext';'T08'='aedpub','jaw'
}
$n=0
foreach($code in $plan.Keys){
  $f=Get-ChildItem -Path $PSScriptRoot -Recurse -Filter "Apostila_${code}_*.md" | Select-Object -First 1
  if(-not $f){ "SEM ARQUIVO $code"; continue }
  $t=[IO.File]::ReadAllText($f.FullName,[Text.Encoding]::UTF8)
  if($t -match '### Figuras de Apoio'){ "JA TEM $code"; continue }
  $blk="### Figuras de Apoio`r`n`r`n"
  $i=1
  foreach($k in $plan[$code]){
    $d=$img[$k]
    if(-not (Test-Path (Join-Path $PSScriptRoot "imagens\$($d[0])"))){ "FALTA IMG $($d[0])"; continue }
    $rel=$(if($f.DirectoryName -like '*lote-*'){'../imagens/'}else{'imagens/'})+$d[0]
    $blk+="![Figura $i - $($d[1])]($rel)`r`n*Figura $i - $($d[1]) Crédito: $($d[2]). Licença: $($d[3]). Fonte: Wikimedia Commons.*`r`n`r`n"
    $i++
  }
  $m=[regex]::Match($t,'(?m)^## (SEÇÃO )?6[\.\s]')
  if(-not $m.Success){ "SEM SECAO 6 $code"; continue }
  $t=$t.Insert($m.Index,$blk+"---`r`n`r`n")
  [IO.File]::WriteAllText($f.FullName,$t,$utf8); $n++
}
"Apostilas atualizadas: $n"

