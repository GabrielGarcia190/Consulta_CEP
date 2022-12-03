import {
  JSXElementConstructor,
  ReactElement,
  ReactFragment,
  ReactPortal,
  useEffect,
  useState,
} from "react";
import Modal from "react-modal";
import maps from "./assets/google_maps.png";
import { Copy, Warning, X } from "phosphor-react";
import "./styles/modal.css";
import copy from "copy-to-clipboard";
Modal.setAppElement("#root");

function App() {
  const [CEP, useCEP] = useState("");
  const [modalIsOpen, setIsOpen] = useState(false);
  const [modalError, setModalError] = useState(false);
  const [copySucess, setcopySucess] = useState(false);
  const [resCEP, setresCEP] = useState({
    cep: "",
    logradouro: "",
    complemento: "",
    bairro: "",
    localidade: "",
    uf: "",
    ibge: "",
    gia: "",
    ddd: "",
    siafi: "",
  });

  async function consultaCEP() {
    setcopySucess(false);
    setModalError(false);
    setIsOpen(false);
    try {
      if (CEP.length === 9) {
        await fetch(`https://viacep.com.br/ws/${CEP}/json/`)
          .then((res) => res.json())
          .then((data) => {
            if (data.erro) {
              setIsOpen(false);
              setModalError(true);
              console.log(data.erro);
            } else {
              setresCEP(data);
              setIsOpen(true);
            }
            return;
          });
      } else {
        setIsOpen(false);
        setModalError(true);
        return;
      }
    } catch (error) {
      console.log(error);
    }
  }


  
  function handleCpfChange(event: React.ChangeEvent<HTMLInputElement>) {
    const formattedCEP = event.target.value
      .replace(/\D/g, "")
      .replace(/(\d{5})(\d)/, "$1-$2")
      .replace(/(-\d{3})\d+?$/, "$1");

    useCEP(formattedCEP);
  }

  function closeModal() {
    setIsOpen(false);
  }

  function closeModalError() {
    setModalError(false);
  }

  function copyMessage() {
    console.log(
      `CEP: ${resCEP.cep} - ${resCEP.logradouro} - ${resCEP.bairro} - ${resCEP.localidade}/${resCEP.uf}`
    );
    copy(
      `CEP: ${resCEP.cep} - ${resCEP.logradouro} - ${resCEP.bairro} - ${resCEP.localidade}/${resCEP.uf}`
    );
    setcopySucess(true);
  }

  return (
    <div className="bg-[#161B22] w-screen h-screen flex flex-col items-center justify-center">
      <div className="flex items-center justify-center">
        <img src={maps} className="w-16 " />
        <h1 className="text-white font-semibold text-7xl ml-5 ">
          Consulta CEP
        </h1>
      </div>

      <input
        id="cep"
        type="text"
        value={CEP}
        onChange={handleCpfChange}
        className="bg-[#21262D] p-2 text-center text-[#AAA4A4] mt-10 rounded-md w-[25vw]"
        placeholder="Digite um CEP"
      />
      <p className="text-[#AAA4A4]  mt-2 text-sm">Ex: 00000-000</p>

      <button
        className="  px-4 py-2 mt-3 uppercase text-white font-bold rounded-xl bg-[#349B2B]"
        data-modal-toggle="modal-resultado"
        type="submit"
        onClick={consultaCEP}
      >
        CONSULTAR
      </button>
      <div>
        <Modal
          isOpen={modalError}
          overlayClassName="modal-overlay"
          contentLabel="modal-resultado"
          className="flex flex-col rounded-lg  bg-[#161B22] w-[30vw] h-[30vh] shadow-xl"
        >
          <button onClick={closeModalError}>
            <X
              size={30}
              className="text-red-600 ml-[27vw] mt-2"
              weight="bold"
            />
          </button>
          <div className="bg-[#161B22] text-[#AAA4A4] mx-auto flex h-[30vh] flex-col  items-center">
            <Warning size={50} />
            <h1 className="ml-4 text-white text-xl ">- Erro ao consultar -</h1>
            <p className="ml-4 mt-4">Por favor insira um CEP válido !!!</p>
          </div>
        </Modal>

        <Modal
          isOpen={modalIsOpen}
          overlayClassName="modal-overlay"
          contentLabel="modal-resultado"
          className="flex flex-col rounded-lg  bg-[#161B22] w-[35vw] h-[60vh] shadow-xl"
        >
          <div className="bg-[#161B22] text-[#AAA4A4] mx-auto flex flex-col mt-4 items-center">
            <div className="flex flex-col items-center justify-center">
              <button onClick={closeModal}>
                <X size={30} className="text-red-600 ml-[30vw]" weight="bold" />
              </button>
              <h1 className="font-bold text-white text-xl">
                - Resultado da Busca -
              </h1>
            </div>
            <div className="flex flex-row mt-5 text-center w-[30vw]">
              <p className="bg-[#21262d] p-2 w-full rounded-lg">
                {resCEP.logradouro == "" ? "Não encontrado" : resCEP.logradouro}
                {/* 08321-072 */}
              </p>
            </div>
            <div className="flex flex-row mt-5 text-center w-[30vw]">
              <p className="bg-[#21262d] p-2 w-full rounded-lg">
                {resCEP.bairro == "" ? "Não encontrado" : resCEP.bairro}
              </p>
            </div>
            <div className="flex flex-row mt-5 text-center w-[30vw]">
              <p className="bg-[#21262d] p-2 w-full  rounded-lg">
                {resCEP.localidade == "" ? "Não encontrado" : resCEP.localidade}
              </p>
              <p className="bg-[#21262d] p-2 w-[10vh] ml-4 rounded-lg">
                {resCEP.uf == "" ? "Não encontrado" : resCEP.uf}
              </p>
            </div>
            <div className="mt-8 flex justify-center  items-center w-[30vw]">
              <button onClick={copyMessage}>
                <Copy size={40} color="#AAA4A4" weight="bold" />
              </button>
              {copySucess ? (
                <p className="ml-4">Copiado com sucesso !!!</p>
              ) : null}
            </div>
          </div>
        </Modal>
      </div>
    </div>
  );
}

export default App;
