$ErrorActionPreference='Stop'
$utf8=New-Object System.Text.UTF8Encoding($false)

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
'samu'=@('Motolancias_SAMU_Distrito_Federal.jpg','Motolâncias do SAMU 192 (Distrito Federal).','Antonio Cruz/Agência Brasil','CC BY 3.0 BR (https://creativecommons.org/licenses/by/3.0/br/)');
'kit'=@('First_aid_kit_on_wall.png','Maleta e estação de primeiros socorros sinalizada.','Leigh Blackall','CC BY 2.0 (https://creativecommons.org/licenses/by/2.0/)');
'glove'=@('Disposable_nitrile_glove.jpg','Luva de proteção individual em nitrila para biossegurança.','Wikimedia Commons','Domínio público');
'burn'=@('Fourth-degree-burn.png','Classificação de profundidade nas queimaduras graves.','Baedr-9439','CC0');
'heat'=@('Heat-symptoms-2022-final.png','Sinais clínicos de exaustão térmica e intermação (golpe de calor).','National Weather Service / CDC / NIOSH','Domínio público');
'rescue'=@('Proper_Rescue_Method.jpg','Técnica segura de salvamento aquático sem entrada impulsiva.','US Army Corps of Engineers','Domínio público');
'vessels'=@('2102_Comparison_of_Artery_and_Vein.jpg','Estrutura anatômica comparativa entre artérias e veias.','OpenStax College','CC BY 3.0 (https://creativecommons.org/licenses/by/3.0/)');
'stb'=@('STOP_THE_BLEED_Course_8209645_.jpg','Treinamento prático de controle de sangramentos ameaçadores à vida.','U.S. Air Force, Staff Sgt. Juan Paz','Domínio público');
'israeli'=@('The_Emergency_Bandage_in_different_forms_of_packaging.jpg','Bandagem compressiva de emergência para controle hemorrágico.','Struppig taucher','CC BY 4.0 (https://creativecommons.org/licenses/by/4.0/)');
'gauze'=@('Gauze_bandage.png','Gaze estéril para compressão direta e preenchimento de feridas.','im_tau','CC BY 4.0 (https://creativecommons.org/licenses/by/4.0/)');
'tccc'=@('Defenders_participate_in_TCCC_Combat_Lifesaver_training_9464952_.jpg','Prática supervisionada de preenchimento de feridas (wound packing) e hemostasia.','U.S. Air Force, Tech. Sgt. Kristen Pittman','Domínio público');
'abdwound'=@('Open-abdominal-wound-dressed.png','Curativo oclusivo em ferimento abdominal complexo (evisceração).','Baedr-9439','CC0');
'harness'=@('Worker_with_safety_harness_9248564334_.jpg','Cinturão de segurança tipo paraquedista para trabalho em altura (NR-35).','National Institute for Occupational Safety and Health (NIOSH)','Domínio público');
'highvolt'=@('High_voltage_warning_sign_Beromuenster.JPG','Sinalização internacional de perigo de alta tensão elétrica.','Timberwind','Domínio público');
'start'=@('START_Triage_algorithm.png','Algoritmo visual de Triagem START para incidentes com múltiplas vítimas.','HZS ČR (Corpo de Bombeiros da República Tcheca)','Domínio público');
'ankle'=@('Ankle-wrap.png','Enfaixamento funcional de contenção em entorse articular.','Baedr-9439','CC0');
'eye'=@('Medic-open-patients-eye-1.png','Inspeção ocular e abertura palpebral no atendimento inicial.','Baedr-9439','CC0')
}

$plan=@{
'C01'=@('kit','eye');
'C02'=@('glove','kit');
'C03'=@('samu');
'C04'=@('jaw','eye');
'C05'=@('cpr','bvm');
'C06'=@('aed','aedpub','aedsign');
'C07'=@('heimlich');
'C08'=@('fast','actfast','heart');
'C09'=@('epi','ana','inhaler');
'C10'=@('tq','gauze');
'C11'=@('splint','collar');
'C12'=@('burn','heat');
'E01'=@('kit','aedpub');
'E02'=@('cprbaby','cpr');
'E03'=@('heimlich');
'E04'=@('epi','ana');
'E05'=@('splint','ankle');
'E06'=@('epi','inhaler');
'E07'=@('kit','aedsign');
'A01'=@('aedpub','kit');
'A02'=@('aed','heart');
'A03'=@('splint','ankle');
'A04'=@('heat');
'A05'=@('rescue','heat');
'A06'=@('aed','aedpub');
'H01'=@('vessels');
'H02'=@('stb');
'H03'=@('israeli','gauze');
'H04'=@('tccc','gauze');
'H05'=@('tq');
'H06'=@('abdwound','collar');
'H07'=@('tq','stb');
'T01'=@('loto','harness');
'T02'=@('loto','tq');
'T03'=@('bvm','eyewash','nfpa');
'T04'=@('highvolt','loto');
'T05'=@('harness','collar');
'T06'=@('confined','bvm');
'T07'=@('ext');
'T08'=@('start','jaw')
}

$n=0
foreach($code in $plan.Keys){
  $f=Get-ChildItem -Path $PSScriptRoot -Recurse -Filter "Apostila_${code}_*.md" | Select-Object -First 1
  if(-not $f){ "SEM ARQUIVO $code"; continue }
  $t=[IO.File]::ReadAllText($f.FullName,[Text.Encoding]::UTF8)
  
  # Remove previous Figuras de Apoio block if present to cleanly update
  $t=[regex]::Replace($t,'(?ms)^### Figuras de Apoio\r?\n.*?^---\r?\n\r?\n','')
  
  $blk="### Figuras de Apoio`r`n`r`n"
  $i=1
  foreach($k in $plan[$code]){
    $d=$img[$k]
    if(-not (Test-Path (Join-Path $PSScriptRoot "imagens\$($d[0])"))){ "FALTA IMG $($d[0])"; continue }
    $rel=$(if($f.DirectoryName -like '*lote-*'){'../imagens/'}else{'imagens/'})+$d[0]
    $blk+="![Figura $i - $($d[1])]($rel)`r`n*Figura $i - $($d[1]) Crédito: $($d[2]). Licença: $($d[3]). Fonte: Wikimedia Commons.*`r`n`r`n"
    $i++
  }
  $m=[regex]::Match($t,'(?m)^## (SE..O )?6[\.\s]')
  if(-not $m.Success){ "SEM SECAO 6 $code"; continue }
  $t=$t.Insert($m.Index,$blk+"---`r`n`r`n")
  [IO.File]::WriteAllText($f.FullName,$t,$utf8); $n++
}
"Total de apostilas com figuras atualizadas: $n"
