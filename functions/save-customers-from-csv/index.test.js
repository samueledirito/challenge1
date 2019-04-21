const { convertToJson } = require('./index');

const csvContent = `ID_UTENTE;CODICE_CLIENTE;EMAIL;NOME;COGNOME;DATA_NASCITA;CODICE_FISCALE;STATO;ATTIVO;NUOVO;RETE;AGENTE;CANONE_RAI
111;00245;po@zuwuhe.vc;Emanuele;SANTI;04_02_1965;DLRSNT58C44D327V;INVALIDO;SI;NO;App;MARIA;SI
34;00088;ibnocan@gabi.mt;Ginevra;CAPONI;25_02_1976;MGGGMM60B62Z639J;STANDBY;NO;NO;Tate Commerciale;EMILIO;SI
28;00073;po@gu.dk;Luca;BATACCHI;13_05_1980;SLCGNN55D22D800S;DISABILITATO;NO;SI;Sito Web;NERI;NO
186;00116;pe@kelagne.it;Ferdinando;CLEMENTE;05_01_1976;RSNCST62A65I789O;STANDBY;NO;SI;App;BRUNO;NO
98;00176;duv@tufucik.fi;Irene;FIORENTINI;05_10_1961;RGGMTT00T31G872Z;ATTIVAZIONE;SI;NO;App;ANTONELLA;NO
100;00042;edulat@igeleik.mo;Stefania;ROMANELLI;27_11_1996;FLCSMN57R13C618V;BLOCCATO;NO;NO;Tate Commerciale;LEA;SI
80;00093;akubadid@amuibu.pn;David;PERUZZI;24_10_1994;MRTRSL72S52B922D;STANDBY;SI;NO;Tate Assistenza;MASSIMO;SI
`;

describe('Parsing row', () => {
  let json;

  beforeEach(async () => {
    json = await convertToJson(csvContent);
  });

  it('should count 7 entries', () => {
    expect(json).toHaveLength(7);
  });

  it('should convert BirthDate to correct format date', () => {
    expect(json[0].BirthDate).toEqual('04/02/1965');
  });

  it('should convert Active, New and RaiFee to boolean values', () => {
    expect(json[0].Active).toEqual(true);
    expect(json[0].New).toEqual(false);
    expect(json[0].RaiFee).toEqual(true);
  });
});
