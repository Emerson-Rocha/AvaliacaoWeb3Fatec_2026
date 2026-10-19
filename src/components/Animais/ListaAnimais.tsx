"use client";

import "./ListaAnimais.css";

import Titulo from "@/components/UI/Titulo/Titulo";
import { Animal } from "@/types/animal";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";


export default function ListaAnimais() {
  const router = useRouter();
  // const [animais, setAnimais] = useState<Animal[]>([]);
  const [search, setSearch] = useState("");
  const [tipoFiltro, setTipoFiltro] = useState("");
  const [porteFiltro, setPorteFiltro] = useState("");
  const [sexoFiltro, setSexoFiltro] = useState("");
  const [statusFiltro, setStatusFiltro] = useState("");
  const [animalSelecionado, setAnimalSelecionado] = useState<Animal | null>(null);


  //const [animais, setAnimais] = useState<Animal[]>([]);
  const [animais, setAnimais] = useState([]);




  // ======== *(PROFERSSOR) ======================== 

  // 1º Passo 
  const [qtd, setQtd] = useState(0);
  const servidor: String = "http://localhost:3010";
  //CRIAR UMA FUNÇÃO PARA CARREGAR O QUANTIDADE DE ANIMAIS
  async function qtdAnimal() {
    try {
      const url: string = servidor + "/qtd"
      await fetch(url)
        .then((resp) => { return resp.json() })
        .then((dado) => { return setQtd(dado.qtd) })


    } catch (e) {
      console.log("tipo de erro :" + e);
    }

  }
//===========================================
  //====* (PROFESSOR ) CARREGAR ANIMAIS 
 const servidorImg:string  ="http://localhost:3010";
  async function carregarAn() {
    try {
      const url: string = servidor + "/animais";
      await fetch(url)
        .then((resp) => { return resp.json() })
        .then((dado) => { setAnimais(dado); 

          console.log("Animais recebidos:"+ JSON.stringify(dado));
        })
         

    } catch (error) {

      console.error("Erro ao carregar animais:", error);

    }
  }

//===========================================
  useEffect(() => {
    qtdAnimal();
    carregarAn();
  }, []);



  useEffect(() => {
    //carregarAnimais();


  }, []);

  async function carregarAnimais() {
    try {
      const response = await fetch(
        "/api/animais"
      );

      const data = await response.json();

      setAnimais(data);
    } catch (error) {
      console.error(
        "Erro ao carregar animais:",
        error
      );
    }
  }

  const animaisFiltrados = animais.filter(
    animal => {
      const termo = search.toLowerCase();

      const matchSearch =
        animal.nome
          .toLowerCase()
          .includes(termo) ||
        animal.rg
          .toLowerCase()
          .includes(termo) ||
        animal.raca
          .toLowerCase()
          .includes(termo) ||
        getTipoTexto(animal.tipo)
          .toLowerCase()
          .includes(termo) ||
        getPorteTexto(animal.porte)
          .toLowerCase()
          .includes(termo) ||
        getSexoTexto(animal.sexo)
          .toLowerCase()
          .includes(termo);

      const matchTipo =
        tipoFiltro === "" ||
        animal.tipo === tipoFiltro;

      const matchPorte =
        porteFiltro === "" ||
        animal.porte === porteFiltro;

      const matchSexo =
        sexoFiltro === "" ||
        animal.sexo === sexoFiltro;

      const matchStatus =
        statusFiltro === "" ||
        animal.status === statusFiltro;

      if (
        animal.status === "falecido" &&
        statusFiltro !== "falecido"
      ) {
        return false;
      }

      return (
        matchSearch &&
        matchTipo &&
        matchPorte &&
        matchSexo &&
        matchStatus
      );
    }
  );

  const animaisOrdenados = [...animaisFiltrados].sort(
    (a, b) => {
      const dataA = a.criadoEm
        ? new Date(a.criadoEm).getTime()
        : Number(a.id);

      const dataB = b.criadoEm
        ? new Date(b.criadoEm).getTime()
        : Number(b.id);

      return dataB - dataA;
    }
  );

  function getTipoTexto(tipo: string) {
    switch (tipo) {
      case "cao":
        return "Cão";
      case "gato":
        return "Gato";
      default:
        return tipo;
    }
  }

  function getPorteTexto(porte: string) {
    switch (porte) {
      case "pequeno":
        return "Pequeno";
      case "medio":
        return "Médio";
      case "grande":
        return "Grande";
      default:
        return porte;
    }
  }

  function getSexoTexto(sexo: string) {
    switch (sexo) {
      case "macho":
        return "Macho";
      case "femea":
        return "Fêmea";
      default:
        return sexo;
    }
  }

  function getStatusTexto(status: string) {
    switch (status) {
      case "disponivel":
        return "Disponível";
      case "indisponivel":
        return "Indisponível";
      case "passeando":
        return "Passeando";
      case "festa_pijama":
        return "Festa do Pijama";
      case "falecido":
        return "Falecido";
      case "adotado":
        return "Adotado";
      default:
        return status;
    }
  }

  function getStatusClass(status: string) {
    switch (status) {
      case "disponivel":
        return "status-disponivel";
      case "indisponivel":
        return "status-indisponivel";
      case "passeando":
        return "status-passeando";
      case "festa_pijama":
        return "status-festa-pijama";
      case "falecido":
        return "status-falecido";
      case "adotado":
        return "status-adotado";
      default:
        return "";
    }
  }

  function editarAnimal(animal: Animal) {
    if (animal.status === "falecido") {
      alert(
        "Animal falecido não pode ser alterado."
      );
      return;
    }

    router.push(
      `/cadastro-animais?id=${animal.id}`
    );
  }

  return (
    <section className="lista-container">
      <Titulo
        titulo="Lista de Animais"
        descricao="Visualize, filtre e gerencie os animais cadastrados."
      />

      <div className="cards-grid">
        <div className="info-card">
          <h3>Total de Animais</h3>
          {/* 2º Passo */}
          <span>{qtd}</span>
        </div>

        <div className="info-card">
          <h3>Disponíveis</h3>
          <span>
            {
              animais.filter(
                animal =>
                  animal.status === "disponivel"
              ).length
            }
          </span>
        </div>

        <div className="info-card">
          <h3>Indisponíveis</h3>
          <span>
            {
              animais.filter(
                animal =>
                  animal.status === "indisponivel"
              ).length
            }
          </span>
        </div>

        <div className="info-card">
          <h3>Adotados</h3>
          <span>
            {
              animais.filter(
                animal =>
                  animal.status === "adotado"
              ).length
            }
          </span>
        </div>
      </div>

      <div className="filtro-container">
        <input
          type="text"
          placeholder="Buscar por nome, RG, tipo, porte, sexo ou raça..."
          value={search}
          onChange={e =>
            setSearch(e.target.value)
          }
        />

        <select
          value={tipoFiltro}
          onChange={e =>
            setTipoFiltro(e.target.value)
          }
        >
          <option value="">Todos os tipos</option>
          <option value="cao">Cão</option>
          <option value="gato">Gato</option>
        </select>

        <select
          value={porteFiltro}
          onChange={e =>
            setPorteFiltro(e.target.value)
          }
        >
          <option value="">Todos os portes</option>
          <option value="pequeno">Pequeno</option>
          <option value="medio">Médio</option>
          <option value="grande">Grande</option>
        </select>

        <select
          value={sexoFiltro}
          onChange={e =>
            setSexoFiltro(e.target.value)
          }
        >
          <option value="">Todos os sexos</option>
          <option value="macho">Macho</option>
          <option value="femea">Fêmea</option>
        </select>

        <select
          value={statusFiltro}
          onChange={e =>
            setStatusFiltro(e.target.value)
          }
        >
          <option value="">Todos os status</option>
          <option value="indisponivel">
            Indisponível
          </option>
          <option value="disponivel">
            Disponível
          </option>
          <option value="passeando">
            Passeando
          </option>
          <option value="festa_pijama">
            Festa do Pijama
          </option>
          <option value="adotado">
            Adotado
          </option>
          <option value="falecido">
            Falecido
          </option>
        </select>
      </div>

      <div className="table-container">
        <table className="animais-table">
          <thead>
            <tr>
              <th>Animal</th>
              <th>RG</th>
              <th>Tipo</th>
              <th>Porte</th>
              <th>Raça</th>
              <th>Sexo</th>
              <th>Status</th>
              <th>Ações</th>
            </tr>
          </thead>



          <tbody>
            {animais.map(animal => (
          
              <tr key={animal.id_animal}>
               
                <td>
                  <div className="animal-identificacao">
                      
                    {animal.url_foto ? (                     
                      
                      <img
                        src={servidor+animal.url_foto}
                        alt={animal.nome}
                        className="animal-foto"
                      />
                   
                    ) : (
                      <div className="animal-sem-foto">
                        {animal.nome
                          .charAt(0)
                          .toUpperCase()}
                      </div>
                    )}

                    <strong>{  animal.nome}</strong>
                  </div>
                </td>

                <td>{animal.rg}</td>
                <td>{getTipoTexto(animal.especie)}</td>
                <td>{getPorteTexto(animal.porte)}</td>
                <td>{animal.raca}</td>
                <td>{getSexoTexto(animal.sexo)}</td>

                <td>
                  <span
                    className={`status-badge ${getStatusClass(
                      animal.status
                    )}`}
                  >
                    {getStatusTexto(animal.status)}
                  </span>
                </td>

                <td>
                  <div className="acoes">
                    <button
                      onClick={() =>
                        setAnimalSelecionado(animal)
                      }
                    >
                      Detalhes
                    </button>

                    <button
                      className={
                        animal.status === "falecido"
                          ? "editar-bloqueado"
                          : ""
                      }
                      onClick={() =>
                        editarAnimal(animal)
                      }
                    >
                      Editar
                    </button>
                  </div>
                </td>
              </tr>
            ))}

            {animaisOrdenados.length === 0 && (
              <tr>
                <td
                  colSpan={8}
                  className="sem-registros"
                >
                  Nenhum animal encontrado.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>




      {animalSelecionado && (
        <div
          className="modal-overlay"
          onClick={() =>
            setAnimalSelecionado(null)
          }
        >
          <div
            className="modal-content"
            onClick={e => e.stopPropagation()}
          >
            <h2>Perfil do Animal</h2>

            {animalSelecionado.fotos.length > 0 && (
              <div className="modal-fotos">
                {animalSelecionado.fotos.map(
                  foto => (
                    <img
                      key={foto}
                      src={foto}
                      alt={animalSelecionado.nome}
                    />
                  )
                )}
              </div>
            )}

            <div className="detalhes-grid">
              <p>
                <strong>Nome:</strong>{" "}
                {animalSelecionado.nome}
              </p>
              <p>
                <strong>RG:</strong>{" "}
                {animalSelecionado.rg}
              </p>
              <p>
                <strong>Tipo:</strong>{" "}
                {getTipoTexto(
                  animalSelecionado.tipo
                )}
              </p>
              <p>
                <strong>Porte:</strong>{" "}
                {getPorteTexto(
                  animalSelecionado.porte
                )}
              </p>
              <p>
                <strong>Raça:</strong>{" "}
                {animalSelecionado.raca}
              </p>
              <p>
                <strong>Idade:</strong>{" "}
                {animalSelecionado.idade}
              </p>
              <p>
                <strong>Sexo:</strong>{" "}
                {getSexoTexto(
                  animalSelecionado.sexo
                )}
              </p>
              <p>
                <strong>Status:</strong>{" "}
                {getStatusTexto(
                  animalSelecionado.status
                )}
              </p>
            </div>

            <h2>Prontuário</h2>
            <div className="detalhes-grid">
              <p>
                <strong>Castrado:</strong>{" "}
                {animalSelecionado.prontuario
                  .castrado
                  ? "Sim"
                  : "Não"}
              </p>
              <p>
                <strong>Vermifugado:</strong>{" "}
                {animalSelecionado.prontuario
                  .vermifugado
                  ? "Sim"
                  : "Não"}
              </p>
              <p>
                <strong>Vacinado:</strong>{" "}
                {animalSelecionado.prontuario
                  .vacinado
                  ? "Sim"
                  : "Não"}
              </p>
              <p>
                <strong>Vacinas:</strong>{" "}
                {animalSelecionado.prontuario
                  .vacinas.length > 0
                  ? animalSelecionado.prontuario.vacinas.join(
                    ", "
                  )
                  : "Nenhuma informada"}
              </p>
              <p>
                <strong>Observações:</strong>{" "}
                {animalSelecionado.prontuario
                  .observacoes ||
                  "Nenhuma observação"}
              </p>
            </div>

            <h2>Adestramento</h2>
            <div className="detalhes-grid">
              <p>
                <strong>Comandos:</strong>{" "}
                {animalSelecionado.adestramento
                  .comandos.length > 0
                  ? animalSelecionado.adestramento.comandos.join(
                    ", "
                  )
                  : "Nenhum comando informado"}
              </p>
              <p>
                <strong>Observações:</strong>{" "}
                {animalSelecionado.adestramento
                  .observacoes ||
                  "Nenhuma observação"}
              </p>
            </div>

            {animalSelecionado.status ===
              "falecido" &&
              animalSelecionado.falecimento && (
                <>
                  <h2>Falecimento</h2>
                  <div className="detalhes-grid">
                    <p>
                      <strong>Causa:</strong>{" "}
                      {
                        animalSelecionado
                          .falecimento.causa
                      }
                    </p>
                    <p>
                      <strong>Data:</strong>{" "}
                      {
                        animalSelecionado
                          .falecimento.data
                      }
                    </p>
                  </div>
                </>
              )}

            <div className="modal-actions">
              {animalSelecionado.status !==
                "falecido" && (
                  <button
                    className="editar-btn"
                    onClick={() =>
                      editarAnimal(animalSelecionado)
                    }
                  >
                    Editar Animal
                  </button>
                )}

              <button
                className="fechar-modal"
                onClick={() =>
                  setAnimalSelecionado(null)
                }
              >
                Fechar
              </button>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}
