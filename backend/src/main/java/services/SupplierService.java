package services;

import data.entities.SupplierEntity;
import data.repositories.SupplierRepository;
import jakarta.enterprise.context.ApplicationScoped;
import jakarta.inject.Inject;
import jakarta.transaction.Transactional;
import web.dtos.SupplierDto;
import web.mappers.SupplierMapper;

@ApplicationScoped
public class SupplierService {
    @Inject
    SupplierRepository supplierRepository;
    @Inject
    SupplierMapper supplierMapper;
    @Transactional
    public SupplierDto findByName(String name) {
        SupplierEntity entity = supplierRepository.findByName(name);
        return supplierMapper.toDTO(entity);
    }
    @Transactional
    public SupplierDto findByCity(String city) {
        SupplierEntity entity = supplierRepository.findByCity(city);
        return supplierMapper.toDTO(entity);
    }
    @Transactional
    public SupplierDto findById(Long id){
        SupplierEntity entity= supplierRepository.findById(id);
        return supplierMapper.toDTO(entity);
    }
}
