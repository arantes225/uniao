$ErrorActionPreference='Stop'
$utf8=New-Object System.Text.UTF8Encoding($false)

$img=@{
'cpr'=@('Cardiopulmonary_Resuscitation_Adult.jpg','Posicionamento para compressões torácicas no adulto.','Illinois Waterway Visitor Center, US Army Corps of Engineers','Domínio público');
'cprbaby'=@('CardiopulmonaryResuscitationBabyDummy.jpg','Treino de RCP em manequim de lactente.','Uniformed Services University','Domínio público');
'aed'=@('Modern_AED_Automated_external_defibrillator.png','Desfibrilador Externo Automático (DEA).','VoLid27','CC0');
'aedpub'=@('Public_access_AED_with_coded_lock.jpg','DEA de acesso público em gabinete sinalizado.','Christian P. Nielsen','CC0');
'aedsign'=@('ISO_7010_E010.png','Sinal ISO 7010 E010: localização do DEA.','M!dgard','CC0');
'eyewash'=@('ISO_7010_E011.png','Sinal ISO 7010 E011: lava-olhos de emergência.','MaxxL','Domínio público');
'heimlich'=@('Abdominal_thrusts_against_choking_cropped_.jpg','Compressões abdominais em vítima consciente (manobra de Heimlich).','US Army Medical Department Center and School','Domínio público');
'jaw'=@('Jaw_thrust.jpg','Tração da mandíbula (jaw thrust) para abertura de via aérea no trauma.','Department of the Army (EUA)','Domínio público');
'tq'=@('Tourniquet_application.jpg','Aplicação de torniquete tático em treinamento prático.','U.S. Navy, MC2 Barry R. Hirayama','Domínio público');
'splint'=@('Splinting-an-arm.png','Imobilização de membro superior com tala moldável.','Baedr-9439','CC0');
'collar'=@('Cervical-collar-application.png','Aplicação técnica de colar cervical para restrição de movimento.','Baedr-9439','CC0');
'bvm'=@('Bag-valve-mask.jpg','Dispositivo bolsa-válvula-máscara (ambu) para ventilação de resgate.','Another-anon-artist-234','CC0');
'epi'=@('Epinephrine-injection.png','Aplicação intramuscular de autoinjetor de adrenalina na face anterolateral da coxa.','Baedr-9439','CC0');
'ana'=@('Signs_and_symptoms_of_anaphylaxis.png','Sinais e sintomas sistêmicos da reação anafilática.','Mikael Häggström','CC0');
'fast'=@('Identify_the_symptoms_of_a_stroke_using_the_FAST_method.png','Reconhecimento precoce do AVC pelo método FAST.','U.S. Food and Drug Administration (vetor: Fvasconcellos)','Domínio público');
'actfast'=@('Act_FAST.png','Sinais de alerta do Acidente Vascular Cerebral (Act FAST).','U.S. CDC, NCCDPHP','Domínio público');
'ext'=@('Fire_extinguisher.png','Extintor portátil para combate inicial a princípios de incêndio.','OpenClipart','CC0');
'nfpa'=@('NFPA_704.png','Diamante de Hommel (NFPA 704) para identificação de risco químico.','Denelson83','Domínio público');
'loto'=@('Lockout_Tagout_14853353063_.jpg','Procedimento de bloqueio e etiquetagem de energias perigosas (LOTO).','NAVFAC (U.S. Navy)','Domínio público');
'inhaler'=@('AsthmaInhaler.jpg','Inalador pressurizado dosimetrado para crise de broncoespasmo.','Wikimedia Commons (Mendel, assumido)','Domínio público');
'heart'=@('Blausen_0463_HeartAttack.png','Fisiopatologia do Infarto Agudo do Miocárdio por oclusão coronariana.','Blausen Medical Communications, Inc.','CC BY 3.0 (https://creativecommons.org/licenses/by/3.0/)');
'confined'=@('Confined_Space_Entry_32884133734_.jpg','Tripé de içamento e linha de vida para resgate em espaço confinado (NR-33).','Georgia National Guard','CC BY 2.0 (https://creativecommons.org/licenses/by/2.0/)');
'samu'=@('Motolancias_SAMU_Distrito_Federal.jpg','Unidades de resposta rápida (motolâncias) do SAMU 192.','Antonio Cruz/Agência Brasil','CC BY 3.0 BR (https://creativecommons.org/licenses/by/3.0/br/)');
'kit'=@('First_aid_kit_on_wall.png','Maleta e estação de primeiros socorros sinalizada e acessível.','Leigh Blackall','CC BY 2.0 (https://creativecommons.org/licenses/by/2.0/)');
'glove'=@('Disposable_nitrile_glove.jpg','Luva de proteção individual em nitrila para barreira biológica.','Wikimedia Commons','Domínio público');
'burn'=@('Fourth-degree-burn.png','Acometimento tecidual profundo nas queimaduras graves de espessura total.','Baedr-9439','CC0');
'heat'=@('Heat-symptoms-2022-final.png','Quadro comparativo clínico entre exaustão térmica e golpe de calor (intermação).','National Weather Service / CDC / NIOSH','Domínio público');
'rescue'=@('Proper_Rescue_Method.jpg','Técnica segura de salvamento aquático a partir da borda sem entrada impulsiva.','US Army Corps of Engineers','Domínio público');
'vessels'=@('2102_Comparison_of_Artery_and_Vein.jpg','Comparação histológica e pressórica entre artérias e veias.','OpenStax College','CC BY 3.0 (https://creativecommons.org/licenses/by/3.0/)');
'stb'=@('STOP_THE_BLEED_Course_8209645_.jpg','Estação prática de controle de sangramentos ameaçadores à vida.','U.S. Air Force, Staff Sgt. Juan Paz','Domínio público');
'israeli'=@('The_Emergency_Bandage_in_different_forms_of_packaging.jpg','Bandagem compressiva tática de emergência para controle hemorrágico.','Struppig taucher','CC BY 4.0 (https://creativecommons.org/licenses/by/4.0/)');
'gauze'=@('Gauze_bandage.png','Rolo de gaze estéril para compressão direta e preenchimento de cavidades.','im_tau','CC BY 4.0 (https://creativecommons.org/licenses/by/4.0/)');
'tccc'=@('Defenders_participate_in_TCCC_Combat_Lifesaver_training_9464952_.jpg','Prática em simulador de preenchimento de feridas (wound packing) e pressão direta.','U.S. Air Force, Tech. Sgt. Kristen Pittman','Domínio público');
'abdwound'=@('Open-abdominal-wound-dressed.png','Proteção com curativo úmido e oclusivo em ferimento abdominal aberto.','Baedr-9439','CC0');
'harness'=@('Worker_with_safety_harness_9248564334_.jpg','Cinturão paraquedista e ancoragem para prevenção de quedas em altura (NR-35).','National Institute for Occupational Safety and Health (NIOSH)','Domínio público');
'highvolt'=@('High_voltage_warning_sign_Beromuenster.JPG','Sinalização de advertência para risco de choque elétrico e arco voltaico.','Timberwind','Domínio público');
'start'=@('START_Triage_algorithm.png','Fluxograma decisório do protocolo START para incidentes com múltiplas vítimas.','HZS ČR (Corpo de Bombeiros da República Tcheca)','Domínio público');
'ankle'=@('Ankle-wrap.png','Enfaixamento compressivo funcional em entorse articular de tornozelo.','Baedr-9439','CC0');
'eye'=@('Medic-open-patients-eye-1.png','Avaliação pupilar e inspeção ocular na abordagem primária.','Baedr-9439','CC0');
'chinlift'=@('Head-tilt-chin-lift-maneuver.jpg','Manobra de inclinação da cabeça e elevação do mento (head-tilt/chin-lift).','Another-anon-artist-234','CC0');
'cprhands'=@('Chest-compression-hand-placement.jpg','Posicionamento correto das mãos na metade inferior do esterno durante a RCP.','Another-anon-artist-234','CC0');
'cprheart'=@('CPR-heart-compression.png','Mecanismo de bomba cardíaca e ejeção sanguínea durante a compressão torácica externa.','Baedr-9439','CC0');
'pocketmask'=@('Cpr-pocket-mask.jpg','Máscara de bolso (pocket mask) com válvula unidirecional para ventilação segura.','Another-anon-artist-234','CC0');
'bvm2'=@('Bvm-with-two-medics.png','Técnica de ventilação com bolsa-válvula-máscara executada por dois socorristas.','Baedr-9439','CC0');
'ecgrip'=@('Ec-grip.jpg','Técnica de pinça E-C para vedação hermética da máscara facial na ventilação.','Another-anon-artist-234','CC0');
'aedpads'=@('Aed-electrode-placement.png','Posicionamento anterolateral padrão das pás adesivas do DEA no tórax desnudo.','Baedr-9439','CC0');
'aedunit'=@('AED-with-electrodes.png','Conjunto completo de Desfibrilador Externo Automático conectado aos eletrodos.','Baedr-9439','CC0');
'supinethrust'=@('Supine-abdominal-thrust.jpg','Compressões em vítima de engasgo que evolui para inconsciência em decúbito dorsal.','Another-anon-artist-234','CC0');
'facialdroop'=@('Stroke-facial-droop.jpg','Assimetria facial aguda (queda da rima labial) característica de Acidente Vascular Cerebral.','Another-anon-artist-234','CC0');
'asthmabronch'=@('Asthma-bronchial-tube-cross-section.png','Fisiopatologia da crise asmática: broncoespasmo, edema de mucosa e hipersecreção.','Baedr-9439','CC0');
'coban'=@('Self-adhering-bandage.png','Atadura autoaderente aplicada para fixação de curativo compressivo hemostático.','Baedr-9439','CC0');
'tqdraw'=@('Tourniquet.png','Esquema técnico de aplicação circunferencial e ajuste do molinete do torniquete.','Baedr-9439','CC0');
'shears'=@('Trauma-shears.jpg','Tesoura ponta-romba de APH para exposição rápida e segura de lesões graves.','Another-anon-artist-234','CC0');
'inlinetrac'=@('In-line-traction.png','Estabilização manual alinhada (in-line) da cabeça e coluna cervical no trauma.','Baedr-9439','CC0');
'logroll'=@('Rolling-a-patient.jpg','Manobra de rolamento em bloco mantendo o alinhamento do eixo cranioespinal.','Another-anon-artist-234','CC0');
'burn2'=@('Superficial-partial-thickness-burn.png','Queimadura de segundo grau superficial com formação de flictenas (bolhas).','Baedr-9439','CC0');
'burn3'=@('Full-thickness-burn.png','Queimadura de terceiro grau (espessura total) com destruição epidérmica e dérmica.','Baedr-9439','CC0');
'rule9'=@('Wallace-rule-of-nines.jpg','Regra dos Nove de Wallace para estimativa da Superfície Corporal Queimada (SCQ).','Another-anon-artist-234','CC0');
'hypowrap'=@('Hypothermia-wrap.png','Envoltório de isolamento térmico passivo e ativo para prevenção da hipotermia no trauma.','Baedr-9439','CC0');
'heatloss'=@('Mechanisms-of-heat-loss.png','Quatro mecanismos físicos de perda de calor corporal: condução, convecção, radiação e evaporação.','Baedr-9439','CC0');
'snake'=@('Snake_bite_symptoms.png','Manifestações clínicas locais e sistêmicas nos acidentes ofídicos (peçonhentos).','Mikael Häggström','Domínio público');
'kneewrap'=@('Knee-wrap.png','Bandagem de contenção e estabilização articular em trauma de joelho.','Baedr-9439','CC0');
'wristwrap'=@('Wrist-wrap.png','Imobilização funcional elástica em entorse ou contusão de punho.','Baedr-9439','CC0');
'buddytape'=@('Buddy-taping-finger.png','Imobilização solidária (buddy taping) em trauma fechado de falanges.','Baedr-9439','CC0');
'mottled'=@('Mottled-skin.jpg','Pele mosqueada (livedo/vasoconstrição periférica) como sinal clínico precoce de hipoperfusão e choque.','Another-anon-artist-234','CC0');
'chestseal'=@('Vented-chest-seal.png','Selo de tórax valvulado aplicado em ferimento torácico penetrante (pneumotórax aberto).','Baedr-9439','CC0');
'pneumo'=@('Tension-pneumothorax.png','Fisiopatologia do pneumotórax hipertensivo com colapso pulmonar e desvio mediastinal.','Baedr-9439','CC0');
'abdexposed'=@('Open-abdominal-wound-exposed.png','Apresentação clínica de trauma abdominal aberto com evisceração antes da proteção úmida.','Baedr-9439','CC0');
'eyewashbottle'=@('Eye-wash-with-pneumatic-bottle.png','Irrigação ocular imediata com frasco lava-olhos portátil em exposição química.','Baedr-9439','CC0');
'openeye2'=@('Open-eye-two-hands.png','Técnica bimanual de abertura palpebral para lavagem contínua da superfície ocular.','Baedr-9439','CC0');
'fullresp'=@('Full-face-respirator.jpg','Máscara respiratória facial inteira com filtro químico para ambientes contaminados.','Another-anon-artist-234','CC0');
'n95'=@('Filtering-half-mask-respirator.jpg','Respirador semifacial filtrante (PFF2/N95) para biossegurança respiratória.','Another-anon-artist-234','CC0');
'rautek'=@('Rautek-maneuver.png','Manobra de Rautek para extração rápida de vítima inconsciente em risco iminente.','Baedr-9439','CC0');
'carry2'=@('Two-person-carry.png','Transporte de apoio por dois socorristas para remoção controlada da zona de risco.','Baedr-9439','CC0');
'blanketdrag'=@('Blanket-drag.png','Arrasto de emergência sobre manta para evacuação rápida por único socorrista.','Baedr-9439','CC0');
'emsbag'=@('EMS-medic-backpack.png','Mochila padronizada de Atendimento Pré-Hospitalar (APH) organizada por compartimentos.','Baedr-9439','CC0');
'comapos'=@('Coma_Position.jpg','Posição Lateral de Segurança (PLS) para proteção da via aérea em vítima inconsciente que respira.','Department of the Army (EUA)','Domínio público');
'carotid'=@('Carotidian_pulse_and_recovery_position.jpg','Palpação do pulso carotídeo e manutenção da permeabilidade da via aérea.','Michal Maňas','Domínio público');
'skullfrac'=@('Depressed-skull-fracture.jpg','Mecanismo de fratura craniana com afundamento em traumatismo cranioencefálico (TCE).','Another-anon-artist-234','CC0');
'raccoon'=@('Raccoon-eyes.jpg','Equimose periorbitária bilateral (sinal do guaxinim) sugestiva de fratura de base de crânio.','Another-anon-artist-234','CC0');
'battles'=@('Battles-sign.jpg','Equimose retroauricular na região mastoidea (sinal de Battle) em trauma craniano grave.','Another-anon-artist-234','CC0')
}

$plan=@{
'C01'=@('kit','emsbag','eye','shears');
'C02'=@('glove','n95','fullresp','kit');
'C03'=@('samu','emsbag','rautek');
'C04'=@('chinlift','jaw','carotid','comapos','eye');
'C05'=@('cpr','cprhands','cprheart','bvm','ecgrip','pocketmask');
'C06'=@('aed','aedpads','aedunit','aedpub','aedsign');
'C07'=@('heimlich','supinethrust','chinlift');
'C08'=@('fast','actfast','facialdroop','heart');
'C09'=@('epi','ana','inhaler','asthmabronch','comapos');
'C10'=@('tq','tqdraw','gauze','coban','shears');
'C11'=@('inlinetrac','collar','logroll','splint','ankle','skullfrac','raccoon','battles');
'C12'=@('burn2','burn3','rule9','heat','hypowrap','snake');
'E01'=@('kit','emsbag','aedpub');
'E02'=@('cprbaby','cpr','cprheart','bvm2');
'E03'=@('heimlich','supinethrust','chinlift');
'E04'=@('epi','ana','asthmabronch','comapos');
'E05'=@('splint','ankle','buddytape','inlinetrac','raccoon');
'E06'=@('epi','inhaler','asthmabronch');
'E07'=@('kit','aedsign','carry2');
'A01'=@('aedpub','kit','emsbag');
'A02'=@('aed','aedpads','heart','cprhands');
'A03'=@('splint','ankle','kneewrap','wristwrap','buddytape');
'A04'=@('heat','heatloss','hypowrap');
'A05'=@('rescue','hypowrap','heat','cpr');
'A06'=@('aed','aedpads','aedpub','bvm2');
'H01'=@('vessels','mottled','hypowrap','cprheart');
'H02'=@('stb','shears','mottled');
'H03'=@('israeli','gauze','coban');
'H04'=@('tccc','gauze','coban');
'H05'=@('tq','tqdraw','shears');
'H06'=@('chestseal','pneumo','abdexposed','abdwound','collar');
'H07'=@('tq','tqdraw','stb','tccc');
'T01'=@('loto','harness','n95');
'T02'=@('loto','tq','coban','shears');
'T03'=@('eyewash','eyewashbottle','openeye2','nfpa','fullresp','bvm');
'T04'=@('highvolt','loto','burn','rule9','aedpads');
'T05'=@('harness','inlinetrac','collar','logroll');
'T06'=@('confined','fullresp','bvm','rautek');
'T07'=@('ext','burn2','burn3','rule9','blanketdrag');
'T08'=@('start','jaw','rautek','carry2','tq')
}

$n=0
foreach($code in $plan.Keys){
  $f=Get-ChildItem -Path $PSScriptRoot -Recurse -Filter "Apostila_${code}_*.md" | Select-Object -First 1
  if(-not $f){ "SEM ARQUIVO $code"; continue }
  $t=[IO.File]::ReadAllText($f.FullName,[Text.Encoding]::UTF8)

  # Não duplicar figuras após a redistribuição editorial de outubro de 2026.
  # Apostilas com imagens distribuídas devem ser editadas diretamente no Markdown.
  if ($t -match '(?m)^!\\[' -and $t -notmatch '(?m)^### Figuras de Apoio') {
    "FIGURAS JÁ DISTRIBUÍDAS: $code (não reinserir galeria)"
    continue
  }
  
  # Remove previous Figuras de Apoio block if present to cleanly update
  $t=[regex]::Replace($t,'(?ms)^### Figuras de Apoio\r?\n.*?^---\r?\n\r?\n','')
  
  $blk="### Figuras de Apoio`r`n`r`n"
  $i=1
  foreach($k in $plan[$code]){
    $d=$img[$k]
    if(-not $d){ "CHAVE INEXISTENTE $k"; continue }
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
